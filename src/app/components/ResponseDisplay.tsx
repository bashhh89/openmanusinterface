interface ResponseDisplayProps {
  response: string | null;
  isLoading?: boolean;
}

export default function ResponseDisplay({ response, isLoading = false }: ResponseDisplayProps) {
  if (isLoading) {
    return (
      <div className="w-full p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!response) {
    return (
      <div className="w-full p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-center text-gray-500 dark:text-gray-400">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Send a message to start the conversation</span>
        </div>
      </div>
    );
  }

  // Check if the response is a JSON string by accident and format it
  let formattedResponse = response;
  if (response.startsWith('{') && response.endsWith('}')) {
    try {
      // Try to parse and re-format JSON for readability
      const parsedJson = JSON.parse(response);
      formattedResponse = JSON.stringify(parsedJson, null, 2);
    } catch (e) {
      // If parsing fails, keep the original response
      formattedResponse = response;
    }
  }

  return (
    <div className="w-full p-6 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="prose dark:prose-invert max-w-none">
        <div className="whitespace-pre-wrap font-sans text-gray-900 dark:text-gray-100 leading-relaxed">
          {formattedResponse.split('\n').map((line, idx) => (
            <p key={idx} className={line.trim() === "" ? "h-4" : "mb-4"}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}