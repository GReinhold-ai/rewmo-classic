import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function LeanLabPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#003B49] font-sans">
      <main className="flex-1 flex flex-col items-center px-4 py-10">
        <h1 className="text-3xl md:text-5xl font-black mb-7 text-[#FF9151] tracking-tight text-center">
          LeanAI Lab
        </h1>

        {/* Intro Section */}
        <section className="max-w-3xl mx-auto mb-10">
          <div className="bg-[#ff915114] rounded-2xl px-8 py-6 shadow text-center">
            <h2 className="text-2xl md:text-3xl font-black mb-3 text-[#15C5C1] tracking-tight">
              Intro to RewmoAI Process Management
            </h2>
            <p className="text-[#B6E7EB] text-lg mb-2">
              Whether you’re running a business, managing a household, or just trying to do more with less—how you <span className="text-[#FF9151] font-bold">manage your process</span> is the secret to bigger savings, less stress, and better results.
            </p>
            <p className="text-[#F7F6F2] text-base mb-3">
              <span className="text-[#FF9151] font-bold">LeanAI Lab</span> makes world-class process improvement simple, visual, and accessible for everyone. Our AI-driven tools help you map out routines, spot waste, and unlock continuous improvement—so you can focus on what matters most.
            </p>
            <p className="text-[#B6E7EB] text-base mt-4">
              <span className="font-semibold text-[#15C5C1]">Ready to get started?</span> Jump into our Process Visualization tool, or explore the modules below!
            </p>
          </div>
        </section>

        {/* Module 1: Quality Approach */}
        <section className="w-full max-w-3xl mb-10">
          <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8">
            <h2 className="text-2xl font-bold mb-2 text-[#FF9151]">Module 1: RewmoAI Quality Approach</h2>
            <p className="text-lg text-[#B6E7EB] mb-3">
              <span className="font-semibold text-[#15C5C1]">Total Quality Management for Individuals & Small Businesses</span>
            </p>

            <div className="mb-4">
              <h3 className="font-bold text-[#FFA36C] mb-1">Learning Objectives</h3>
              <ul className="list-disc pl-5 space-y-1 text-[#B6E7EB] text-base">
                <li>Understand why “quality” matters for your business or personal financial life.</li>
                <li>Define what “quality” means for you or your customers.</li>
                <li>Identify your most important processes (and why they matter).</li>
                <li>Explain the difference between “inspection” and “process improvement.”</li>
                <li>See how small changes can create big results.</li>
                <li>Use RewmoAI features to automate and improve your success.</li>
              </ul>
            </div>

            {/* 1. What Is Quality—and Why Does It Matter? */}
            <div className="mb-4">
              <h4 className="font-bold text-[#FF9151] mb-1">1. What Is Quality—and Why Does It Matter?</h4>
              <p className="text-[#B6E7EB] mb-1">
                “Quality” is more than just a buzzword.<br/>
                For a small business, it could mean happy customers and repeat sales.<br/>
                For individuals or families, it’s peace of mind, less stress, and more money saved.
              </p>
              <div className="bg-[#15C5C114] rounded p-3 mb-1 text-[#15C5C1] font-semibold">
                <span>Deming’s Legacy:</span>
                <span className="block text-[#B6E7EB] font-normal">
                  Dr. W. Edwards Deming taught that improving your process is the surest way to improve your results.<br/>
                  <span className="italic">“Focus on continuously improving every process, no matter how small, and you’ll create lasting success.”</span>
                </span>
              </div>
            </div>

            {/* 2. Who Defines “Quality”? */}
            <div className="mb-4">
              <h4 className="font-bold text-[#FF9151] mb-1">2. Who Defines “Quality”?</h4>
              <p className="text-[#B6E7EB]">
                <span className="text-[#FFA36C] font-semibold">Your customer does!</span><br />
                In business, your customers decide if your product or service is “high quality.”<br/>
                In life, you (or your family) decide what a “quality” experience is—convenience, reliability, results.
              </p>
              <ul className="list-disc pl-5 mt-2 text-[#B6E7EB] text-base">
                <li>Reliability: Does it work every time?</li>
                <li>Speed: How quickly do you deliver?</li>
                <li>Simplicity: Is it easy to use/understand?</li>
                <li>Reputation: Do others trust it?</li>
                <li>Cost: Is it worth the price?</li>
              </ul>
              <div className="mt-2 bg-[#ff915114] rounded p-3 text-[#FF9151] font-semibold">
                <span>Checkpoint:</span>
                <span className="block text-[#B6E7EB] font-normal">List 2–3 qualities that matter most to your customers—or to you. (E.g., “I want paying bills to be fast and automatic.”)</span>
              </div>
            </div>

            {/* 3. What Is a Process? */}
            <div className="mb-4">
              <h4 className="font-bold text-[#FF9151] mb-1">3. What Is a Process?</h4>
              <p className="text-[#B6E7EB]">
                A process is any activity you repeat to get results.<br/>
                <span className="text-[#FFA36C]">In business:</span> “Handling orders,” “managing inventory”<br/>
                <span className="text-[#FFA36C]">In life:</span> “Paying bills,” “meal prepping,” “saving for vacation”
              </p>
              <div className="mt-1 text-[#15C5C1] font-semibold">Key point:</div>
              <div className="ml-4 text-[#B6E7EB] italic mb-2">“Every outcome is the result of a process—so improving your process improves your results.”</div>
            </div>

            {/* 4. Critical vs. Significant Processes */}
            <div className="mb-4">
              <h4 className="font-bold text-[#FF9151] mb-1">4. Critical vs. Significant Processes</h4>
              <p className="text-[#B6E7EB]">
                Not all processes are equal.<br/>
                <span className="text-[#FFA36C] font-semibold">Critical:</span> Directly affect your core results.<br/>
                <span className="text-[#FFA36C] font-semibold">Significant:</span> Support critical ones, but aren’t the main driver.
              </p>
              <div className="mt-1 bg-[#15C5C114] rounded p-3 text-[#15C5C1] font-semibold">
                <span>Checkpoint:</span>
                <span className="block text-[#B6E7EB] font-normal">List one critical process and one significant process in your business or life. (“Saving money each month” is critical; “categorizing spending” is significant.)</span>
              </div>
            </div>

            {/* 5. Inspection vs. Process Improvement */}
            <div className="mb-4">
              <h4 className="font-bold text-[#FF9151] mb-1">5. Inspection vs. Process Improvement</h4>
              <p className="text-[#B6E7EB]">
                <span className="font-semibold text-[#FFA36C]">Inspection:</span> Checking results after the fact.<br/>
                <span className="font-semibold text-[#FFA36C]">Process Improvement:</span> Making the process better so results improve every time.
              </p>
              <div className="mt-1 text-[#15C5C1] font-semibold">Why Process Improvement Wins:</div>
              <ul className="list-disc pl-5 text-[#B6E7EB] text-base">
                <li>Inspection can catch mistakes after they happen.</li>
                <li>Process improvement prevents mistakes before they occur.</li>
              </ul>
            </div>

            {/* 6. The Chain Reaction of Quality */}
            <div className="mb-4">
              <h4 className="font-bold text-[#FF9151] mb-1">6. The Chain Reaction of Quality</h4>
              <ul className="list-disc pl-5 text-[#B6E7EB] text-base">
                <li>Costs go down (less waste, fewer mistakes)</li>
                <li>Productivity goes up</li>
                <li>Customers (or you!) are happier</li>
                <li>Your business grows—or you reach your financial goals faster</li>
              </ul>
            </div>

            {/* 7. RewmoAI in Action */}
            <div className="mb-4">
              <h4 className="font-bold text-[#FF9151] mb-1">7. RewmoAI in Action: Quality Made Simple</h4>
              <ul className="list-disc pl-5 text-[#B6E7EB] text-base">
                <li><span className="font-semibold text-[#FFA36C]">Tracking:</span> RewmoAI tracks your most important processes—spending, saving, payments.</li>
                <li><span className="font-semibold text-[#FFA36C]">Insights:</span> Get smart suggestions for improvement—no spreadsheets needed!</li>
                <li><span className="font-semibold text-[#FFA36C]">Rewards:</span> Every improvement (saving, paying on time) earns you points.</li>
                <li><span className="font-semibold text-[#FFA36C]">Referrals:</span> Help friends/family and earn bonuses together.</li>
              </ul>
            </div>

            {/* Mini-Quiz / Reflection */}
            <div className="bg-[#ff915114] rounded-xl p-5 mb-4 text-[#15C5C1]">
              <h5 className="font-bold mb-2">Mini-Quiz / Reflection</h5>
              <ol className="list-decimal pl-6 space-y-1 text-[#B6E7EB]">
                <li>What does “quality” mean for your business or personal finances?</li>
                <li>Name one process you want to improve this month.</li>
                <li>How could RewmoAI help you automate or track that process?</li>
              </ol>
            </div>

            {/* Key Takeaways */}
            <div className="mb-2">
              <h5 className="font-bold text-[#FF9151] mb-1">Key Takeaways</h5>
              <ul className="list-disc pl-5 text-[#B6E7EB] text-base">
                <li>Quality isn’t just about the end result—it’s about improving how you do things.</li>
                <li>Your customer (or you) decides what “quality” really means.</li>
                <li>Focus first on your most critical processes.</li>
                <li>Prevention is better (and cheaper) than fixing mistakes later.</li>
                <li>RewmoAI is your partner in automating and improving quality in business and life.</li>
              </ul>
            </div>

            <div className="mt-4 text-right">
              <span className="italic text-[#15C5C1] font-semibold">
                [NEXT: Module 2 will dive into Mapping and Measuring Your Processes—customized for RewmoAI.]
              </span>
            </div>
          </div>
        </section>

        {/* Placeholder for Module 2 */}
        <section className="w-full max-w-3xl mb-10">
          <div className="bg-[#072b33] rounded-2xl shadow-xl border border-[#15C5C1] px-8 py-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#FFA36C] mb-2">Module 2: Intro to Tool Flow Charting</h2>
              <p className="text-lg text-[#B6E7EB]">Coming Soon: Learn how to map and measure your most important processes, then optimize them with RewmoAI’s visual tools.</p>
            </div>
            <div>
              <Image src="/icons/flowchart.svg" alt="Flowcharting" width={50} height={50} />
            </div>
          </div>
        </section>
      </main>

      <footer className="text-[#F7F6F2] text-xs py-4 text-center border-t border-[#072b33] bg-[#003B49]">
        <span>
          © {new Date().getFullYear()} RewmoAI |{" "}
          <Link href="/affiliate-disclosure" className="underline hover:text-[#FFA36C] text-[#FF9151]">Affiliate Disclosure</Link> |{" "}
          <Link href="/privacy" className="underline hover:text-[#FFA36C] text-[#FF9151]">Privacy</Link> |{" "}
          <Link href="/terms" className="underline hover:text-[#FFA36C] text-[#FF9151]">Terms</Link>
        </span>
      </footer>
    </div>
  );
}
