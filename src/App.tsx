import { useState } from 'react';

function App() {
  const [activeTab, setActiveTab] = useState<'generate' | 'compare'>('generate');
  const [fileHash, setFileHash] = useState<string | null>(null);
  const [inputHash, setInputHash] = useState('');
  const [comparisonResult, setComparisonResult] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    const file = event.target.files[0];
    const arrayBuffer = await file.arrayBuffer();
    const hash = await generateHash(arrayBuffer);
    setFileHash(hash);
  };

  const generateHash = async (data: ArrayBuffer) => {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  const handleCompare = () => {
    if (!fileHash || !inputHash) {
      setComparisonResult('Please upload a file and provide a hash to compare.');
      return;
    }
    setComparisonResult(fileHash === inputHash ? 'Hashes match!' : 'Hashes do not match.');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700 via-orange-300 to-rose-800 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-lg w-full text-center transform transition duration-500 hover:scale-105">
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === 'generate' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            Generate Hash
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`px-4 py-2 rounded-t-lg font-semibold ${activeTab === 'compare' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-600'}`}
          >
            Compare Hash
          </button>
        </div>

        {activeTab === 'generate' && (
          <div>
            <h1 className="text-2xl font-extrabold mb-6 text-gray-800">PDF Hash Generator</h1>
            <p className="text-gray-500 mb-8">Upload a PDF file to generate a SHA-256 hash.</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="mb-4 w-full p-3 border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            {fileHash && (
              <div className="mt-8 p-6 bg-gray-50 shadow-lg rounded-lg w-full max-w-md mx-auto">
                <h2 className="text-lg font-semibold mb-2 text-gray-700">Generated Hash:</h2>
                <p className="break-all text-gray-600">{fileHash}</p>
              </div>
            )}
            {!fileHash && <p className="text-sm text-gray-400 mt-4">No file uploaded yet.</p>}
          </div>
        )}

        {activeTab === 'compare' && (
          <div>
            <h1 className="text-2xl font-extrabold mb-6 text-gray-800">Compare File Hash</h1>
            <p className="text-gray-500 mb-8">Upload a file and enter a hash to compare.</p>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="mb-4 w-full p-3 border border-gray-300 rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="text"
              placeholder="Enter hash to compare"
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value)}
              className="mb-4 w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={handleCompare}
              className="w-full bg-purple-500 text-white p-3 rounded-lg font-semibold hover:bg-purple-600 transition"
            >
              Compare Hashes
            </button>
            {comparisonResult && (
              <div className="mt-8 p-4 bg-gray-50 shadow-lg rounded-lg">
                <p className="text-lg font-semibold text-gray-700">{comparisonResult}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
