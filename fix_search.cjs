const fs = require('fs');
let f = fs.readFileSync('resources/js/Pages/Pos/Checkout.jsx', 'utf8');

// Find and replace each search bar div
const oldPattern = /<div className="relative shrink-0">[\s\S]*?<\/div>\s*<\/div>/g;
const newContent = `<div className="relative shrink-0">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-on-surface-variant" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-48 rounded-3xl border border-outline-variant bg-white py-2 pl-10 pr-4 text-sm text-on-surface placeholder:text-on-surface/50 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-on-surface/50 hover:text-primary"
                            >
                                ×
                            </button>
                        )}
                    </div>`;

// Count occurrences
let count = 0;
let idx = f.indexOf('<div className="relative shrink-0">');
while (idx !== -1) {
    count++;
    idx = f.indexOf('<div className="relative shrink-0">', idx + 1);
}

console.log(`Found ${count} search bar divs`);

// Replace all occurrences
f = f.replace(oldPattern, newContent);

fs.writeFileSync('resources/js/Pages/Pos/Checkout.jsx', f);
console.log('Fixed!');