import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (query) {
      navigate(`/?search=${encodeURIComponent(query)}`);
    } else {
      navigate("/");
    }
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
        <form onSubmit={handleSearch}>
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
