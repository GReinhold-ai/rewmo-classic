export default function AIRecommendations({ recs }: { recs: any }) {
    return (
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4 text-orange-600">Your Smart Strategy</h3>
        <ul className="space-y-2">
          {recs.top3Strategies?.map((item: string, idx: number) => (
            <li key={idx} className={`p-2 rounded ${item === recs.recommendedOption ? 'bg-orange-100 font-bold' : 'bg-gray-100 dark:bg-gray-800'}`}>
              ✅ {item}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  