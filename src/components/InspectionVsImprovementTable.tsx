import React from "react";

export default function InspectionVsImprovementTable() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#003B49] font-sans p-8">
      <div className="w-full max-w-xl bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] p-8">
        <div className="flex items-center mb-4">
          <img
            src="/rewmo-logo.png"
            alt="RewmoAI Logo"
            style={{ height: 32, width: "auto", marginRight: 12 }}
          />
          <h2 className="text-2xl font-bold text-[#FF9151] text-left">Inspection vs. Process Improvement</h2>
        </div>
        <div className="grid grid-cols-2 gap-0 bg-[#003B49] rounded-xl overflow-hidden border border-[#15C5C1]">
          <div className="py-3 px-4 text-[#15C5C1] font-bold text-center bg-[#003B49] border-r border-[#15C5C1]">
            Inspection
          </div>
          <div className="py-3 px-4 text-[#15C5C1] font-bold text-center bg-[#003B49]">
            Process Improvement
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1] border-r border-[#15C5C1]">
            Check results after the fact
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1]">
            Fix the process at the source
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1] border-r border-[#15C5C1]">
            Finds mistakes late
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1]">
            Prevents mistakes early
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1] border-r border-[#15C5C1]">
            Costly, reactive
          </div>
          <div className="py-3 px-4 text-[#B6E7EB] border-t border-[#15C5C1]">
            Proactive, saves time/money
          </div>
        </div>
      </div>
    </div>
  );
}
