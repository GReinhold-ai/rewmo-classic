// src/pages/admin/amazon-import.tsx
// Admin page to import Amazon Associates earnings reports
import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface ParsedCommission {
  trackingId: string;
  subId: string | null;
  memberId: string | null;
  orderId: string;
  items: number;
  revenue: number;
  earnings: number;
  date: string;
  status: "matched" | "unmatched" | "duplicate";
  existingId?: string;
}

interface ImportSummary {
  total: number;
  matched: number;
  unmatched: number;
  duplicates: number;
  totalEarnings: number;
  memberShare: number;
}

export default function AmazonImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedCommission[]>([]);
  const [summary, setSummary] = useState<ImportSummary | null>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [authReady, setAuthReady] = useState(false);

  // Wait for auth to initialize
  useEffect(() => {
    const { onAuthStateChanged } = require("firebase/auth");
    const { auth } = require("@/lib/firebaseClient");
    
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      if (user) {
        setAuthReady(true);
      } else {
        window.location.href = "/account";
      }
    });

    return () => unsubscribe();
  }, []);

  if (!authReady) {
    return (
      <main className="max-w-6xl mx-auto py-10 px-4 bg-white text-gray-900 min-h-screen">
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </main>
    );
  }

  // Parse CSV file
  const parseCSV = (text: string): any[] => {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];

    // Get headers from first line
    const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""));

    // Parse data rows
    const data: any[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        data.push(row);
      }
    }

    return data;
  };

  // Handle CSV line with quoted values
  const parseCSVLine = (line: string): string[] => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    return values;
  };

  // Extract subId from tracking ID
  // Format: rewmoai-20 or rewmoai-20-SUBID
  const extractSubId = (trackingId: string): string | null => {
    if (!trackingId) return null;

    // Check if tracking ID contains a subId after the base tag
    // e.g., "rewmoai-20-abc123_xyz" → "abc123_xyz"
    const parts = trackingId.split("-");
    if (parts.length >= 3 && parts[0] === "rewmoai") {
      // Rejoin everything after "rewmoai-20"
      return parts.slice(2).join("-");
    }

    // Check for subId in the tracking ID itself
    // Some implementations append subId with underscore
    if (trackingId.includes("_")) {
      const subParts = trackingId.split("_");
      if (subParts.length >= 2) {
        return subParts.slice(1).join("_");
      }
    }

    return null;
  };

  // Find member from subId
  const findMemberFromSubId = async (subId: string): Promise<string | null> => {
    if (!subId) return null;

    try {
      // Check affiliateClicks collection for matching subId
      const clicksRef = collection(db, "affiliateClicks");
      const clickQuery = query(clicksRef, where("subId", "==", subId));
      const clickSnap = await getDocs(clickQuery);

      if (!clickSnap.empty) {
        return clickSnap.docs[0].data().memberId;
      }

      // Try partial match (first 8 chars of memberId)
      const partialId = subId.split("_")[0];
      if (partialId && partialId.length >= 8) {
        const usersRef = collection(db, "users");
        const usersSnap = await getDocs(usersRef);

        for (const doc of usersSnap.docs) {
          if (doc.id.startsWith(partialId)) {
            return doc.id;
          }
        }
      }
    } catch (error) {
      console.error("Error finding member:", error);
    }

    return null;
  };

  // Check for existing commission
  const checkDuplicate = async (orderId: string): Promise<string | null> => {
    try {
      const commissionsRef = collection(db, "affiliateCommissions");
      const dupQuery = query(commissionsRef, where("orderId", "==", orderId));
      const dupSnap = await getDocs(dupQuery);

      if (!dupSnap.empty) {
        return dupSnap.docs[0].id;
      }
    } catch (error) {
      console.error("Error checking duplicate:", error);
    }

    return null;
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setParsedData([]);
      setSummary(null);
      setImportResult(null);
    }
  };

  // Parse and preview the file
  const handleParse = async () => {
    if (!file) return;

    setParsing(true);
    setParsedData([]);
    setSummary(null);

    try {
      const text = await file.text();
      const rawData = parseCSV(text);

      if (rawData.length === 0) {
        alert("No data found in CSV file");
        return;
      }

      // Process each row
      const processed: ParsedCommission[] = [];

      for (const row of rawData) {
        // Amazon CSV columns vary, try to find the right ones
        const trackingId =
          row["Tracking ID"] ||
          row["Tag"] ||
          row["tracking_id"] ||
          row["Associates Tag"] ||
          "";
        const orderId =
          row["Order ID"] ||
          row["order_id"] ||
          row["Items Ordered"] ||
          `AMZ-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        const items = parseInt(row["Items Shipped"] || row["Quantity"] || row["Items"] || "1");
        const revenue = parseFloat(
          (row["Revenue"] || row["Product Revenue"] || row["Sale Amount"] || "0")
            .replace(/[$,]/g, "")
        );
        const earnings = parseFloat(
          (row["Earnings"] || row["Total Earnings"] || row["Commission"] || row["Fees Earnings"] || "0")
            .replace(/[$,]/g, "")
        );
        const date =
          row["Date"] ||
          row["Ship Date"] ||
          row["Order Date"] ||
          new Date().toISOString().split("T")[0];

        // Skip rows with no earnings
        if (earnings <= 0) continue;

        const subId = extractSubId(trackingId);
        const memberId = subId ? await findMemberFromSubId(subId) : null;
        const existingId = await checkDuplicate(orderId);

        processed.push({
          trackingId,
          subId,
          memberId,
          orderId,
          items,
          revenue,
          earnings,
          date,
          status: existingId ? "duplicate" : memberId ? "matched" : "unmatched",
          existingId: existingId || undefined,
        });
      }

      setParsedData(processed);

      // Calculate summary
      const matched = processed.filter((p) => p.status === "matched");
      const unmatched = processed.filter((p) => p.status === "unmatched");
      const duplicates = processed.filter((p) => p.status === "duplicate");

      setSummary({
        total: processed.length,
        matched: matched.length,
        unmatched: unmatched.length,
        duplicates: duplicates.length,
        totalEarnings: processed.reduce((sum, p) => sum + p.earnings, 0),
        memberShare: matched.reduce((sum, p) => sum + p.earnings * 0.5, 0),
      });
    } catch (error) {
      console.error("Error parsing CSV:", error);
      alert("Error parsing CSV: " + (error as Error).message);
    } finally {
      setParsing(false);
    }
  };

  // Import matched commissions
  const handleImport = async () => {
    const toImport = parsedData.filter((p) => p.status === "matched");

    if (toImport.length === 0) {
      alert("No matched commissions to import");
      return;
    }

    if (!confirm(`Import ${toImport.length} commission(s)?`)) return;

    setImporting(true);

    try {
      const response = await fetch("/api/affiliate/import-amazon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          commissions: toImport.map((c) => ({
            memberId: c.memberId,
            orderId: c.orderId,
            subId: c.subId,
            grossAmount: Math.round(c.earnings * 100), // Convert to cents
            orderDate: c.date,
            trackingId: c.trackingId,
          })),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setImportResult(result);
        // Update parsed data to show imported
        setParsedData((prev) =>
          prev.map((p) =>
            p.status === "matched" ? { ...p, status: "duplicate" as const } : p
          )
        );
        alert(`Successfully imported ${result.imported} commission(s)!`);
      } else {
        throw new Error(result.error || "Import failed");
      }
    } catch (error) {
      console.error("Error importing:", error);
      alert("Error importing: " + (error as Error).message);
    } finally {
      setImporting(false);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <main className="max-w-6xl mx-auto py-10 px-4 bg-white text-gray-900 min-h-screen">
      <Head>
        <title>Amazon Import | RewmoAI Admin</title>
      </Head>

      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/affiliate"
          className="text-orange-600 hover:text-orange-700 text-sm mb-2 inline-block"
        >
          ← Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-orange-600">Amazon Associates Import</h1>
        <p className="text-gray-600">
          Import earnings reports from Amazon Associates to credit member commissions
        </p>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-bold text-blue-800 mb-3">📋 How to Export from Amazon</h2>
        <ol className="list-decimal list-inside space-y-2 text-blue-700">
          <li>
            Go to{" "}
            <a
              href="https://affiliate-program.amazon.com/home/reports"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-900"
            >
              Amazon Associates Reports
            </a>
          </li>
          <li>Select <strong>Earnings Report</strong> or <strong>Orders Report</strong></li>
          <li>Choose your date range</li>
          <li>Click <strong>Download Report (CSV)</strong></li>
          <li>Upload the CSV file below</li>
        </ol>
        <p className="mt-4 text-sm text-blue-600">
          <strong>Note:</strong> Only commissions with matching member tracking IDs will be imported.
          Unmatched commissions go to RewmoAI's general revenue.
        </p>
      </div>

      {/* File Upload */}
      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-8 mb-8 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          className="hidden"
        />

        {file ? (
          <div>
            <div className="text-4xl mb-3">📄</div>
            <p className="text-lg font-medium text-gray-800">{file.name}</p>
            <p className="text-sm text-gray-500 mb-4">
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleParse}
                disabled={parsing}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {parsing ? "Parsing..." : "📊 Parse & Preview"}
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setParsedData([]);
                  setSummary(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3">📤</div>
            <p className="text-gray-600 mb-4">
              Drag and drop your Amazon CSV file here, or click to browse
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Select CSV File
            </button>
          </div>
        )}
      </div>

      {/* Summary */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-800">{summary.total}</p>
            <p className="text-sm text-gray-500">Total Rows</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{summary.matched}</p>
            <p className="text-sm text-green-600">Matched</p>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-700">{summary.unmatched}</p>
            <p className="text-sm text-yellow-600">Unmatched</p>
          </div>
          <div className="bg-gray-50 border rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-gray-500">{summary.duplicates}</p>
            <p className="text-sm text-gray-400">Duplicates</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{formatCurrency(summary.totalEarnings)}</p>
            <p className="text-sm text-blue-600">Total Earnings</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-purple-700">{formatCurrency(summary.memberShare)}</p>
            <p className="text-sm text-purple-600">Member Share</p>
          </div>
        </div>
      )}

      {/* Import Button */}
      {parsedData.length > 0 && summary && summary.matched > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-green-800">
                Ready to Import {summary.matched} Commission(s)
              </h3>
              <p className="text-green-600">
                Total: {formatCurrency(summary.matched > 0 ? parsedData.filter(p => p.status === 'matched').reduce((sum, p) => sum + p.earnings, 0) : 0)} → 
                Members get: {formatCurrency(summary.memberShare)}
              </p>
            </div>
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 font-bold"
            >
              {importing ? "Importing..." : "✓ Import Commissions"}
            </button>
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className="bg-green-100 border border-green-300 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-bold text-green-800 mb-2">✅ Import Complete!</h3>
          <p className="text-green-700">
            Successfully imported {importResult.imported} commission(s).
          </p>
          {importResult.errors?.length > 0 && (
            <div className="mt-2 text-red-600">
              <p>Errors: {importResult.errors.length}</p>
              <ul className="list-disc list-inside text-sm">
                {importResult.errors.slice(0, 5).map((err: string, i: number) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Preview Table */}
      {parsedData.length > 0 && (
        <div className="bg-white border rounded-xl overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b">
            <h2 className="text-lg font-bold text-gray-800">Preview ({parsedData.length} rows)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 border-b">
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Tracking ID</th>
                  <th className="py-3 px-4">Member</th>
                  <th className="py-3 px-4 text-right">Items</th>
                  <th className="py-3 px-4 text-right">Revenue</th>
                  <th className="py-3 px-4 text-right">Earnings</th>
                  <th className="py-3 px-4 text-right">Member Share</th>
                </tr>
              </thead>
              <tbody>
                {parsedData.map((row, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      {row.status === "matched" ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                          ✓ Matched
                        </span>
                      ) : row.status === "duplicate" ? (
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-semibold">
                          Duplicate
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold">
                          Unmatched
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600">{row.date}</td>
                    <td className="py-3 px-4 font-mono text-xs">
                      {row.trackingId || "-"}
                    </td>
                    <td className="py-3 px-4">
                      {row.memberId ? (
                        <span className="font-mono text-xs text-green-600">
                          {row.memberId.substring(0, 12)}...
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">{row.items}</td>
                    <td className="py-3 px-4 text-right text-gray-600">
                      {formatCurrency(row.revenue)}
                    </td>
                    <td className="py-3 px-4 text-right font-medium">
                      {formatCurrency(row.earnings)}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600">
                      {row.status === "matched"
                        ? formatCurrency(row.earnings * 0.5)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-8 bg-gray-50 border rounded-xl p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">❓ Troubleshooting</h2>
        <div className="space-y-4">
          <div>
            <p className="font-semibold text-gray-700">Why are commissions "Unmatched"?</p>
            <p className="text-gray-600 text-sm">
              Commissions are unmatched if we can't find a click record with that subId.
              This happens when: the member wasn't logged in, the tracking ID format doesn't include their subId,
              or they used a direct Amazon link instead of going through RewmoAI.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">What happens to unmatched commissions?</p>
            <p className="text-gray-600 text-sm">
              Unmatched commissions aren't imported to member accounts - they become general RewmoAI revenue.
              You can manually assign them if you can identify the member.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">How do I know which CSV columns to use?</p>
            <p className="text-gray-600 text-sm">
              The importer automatically detects common Amazon column names like "Tracking ID", "Earnings", "Items Shipped", etc.
              If your report has different columns, let us know.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
