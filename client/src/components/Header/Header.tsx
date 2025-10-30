import React, { useState } from "react";

interface IHeaderProps {
  onSearch: (query: string) => void;
}

const Header = ({ onSearch }: IHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-10 bg-white shadow-md">
      <div className="w-full px-4 lg:px-6 xl:px-31 py-4 flex items-center justify-between">
        {/* Logo Section */}
        <a href="/" className="flex items-center">
          <div className="w-15 md:w-20 lg:w-25 h-auto">
            <img src="/logo.png" alt="highway delite" />
          </div>
        </a>

        {/* Search Bar Section */}
        <form onSubmit={handleSearch} className="">
          <div className="flex gap-4">
            <input
              type="search"
              placeholder="Search experiences"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-auto md:w-[340px] px-3 py-2 md:py-3 md:px-4 text-sm rounded-sm bg-grey3 placeholder-grey7"
              aria-label="Search experiences"
            />

            <button
              type="submit"
              className="px-3 py-2 md:px-5 md:py-3 text-sm text-black bg-yellow rounded-lg hover:bg-yellow-500 transition duration-150 ease-in-out font-normal md:font-medium shadow-sm cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </header>
  );
};

export default Header;
