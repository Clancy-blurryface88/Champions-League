import { useLocation } from 'react-router-dom';

export default function PageNotFound() {
    const location = useLocation();
    const pageName = location.pathname.substring(1);

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="max-w-md w-full text-center space-y-6">
                <h1 className="text-7xl font-light text-slate-300">404</h1>
                <h2 className="text-2xl font-medium text-white">Page Not Found</h2>
                <p className="text-slate-400">
                    The page <span className="font-medium text-slate-200">"{pageName}"</span> could not be found.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-slate-700 border border-slate-600 rounded-lg hover:bg-slate-600 transition-colors"
                >
                    Go Home
                </button>
            </div>
        </div>
    );
}
