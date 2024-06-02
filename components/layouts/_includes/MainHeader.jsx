"use client";

import debounce from "debounce";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { BiLoaderCircle } from "react-icons/bi";

export default function MainHeader() {
  const [items, setItems] = useState([]);
  const [isSearching, setIsSearching] = useState(null);

  const handleSearchName = debounce(async (event) => {
    if (event.target.value == "") {
      setItems([]);
      return;
    }
    setIsSearching(true);

    try {
      const res = await fetch(
        `/api/products/search-by-name/${event.target.value}`
      );
      const result = await res.json();

      if (result) {
        setItems(result);
        setIsSearching(false);
        return;
      }

      setItems([]);
      setIsSearching(false);
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }, 500);

  return (
    <header id="MainHeader" className="border-b">
      <nav className="flex items-center bg-white w-full mx-auto max-w-[1200px]">
        <div className="flex lg:justify-start justify-between items-center gap-10 max-w-[1150px] w-full px-3 py-5 mx-auto">
          <Link href={"/"}>
            <Image
              width={150}
              height={150}
              alt="eray logo"
              src="/images/logo.svg"
            />
          </Link>

          <div className="relative flex items-center w-full">
            <div className="relative flex items-center w-full p-2 border-2 border-gray-900">
              <button className="flex items-center">
                <AiOutlineSearch size={22} />
              </button>

              <input
                type="text"
                placeholder="Search for anything"
                onChange={handleSearchName}
                className="w-full pl-3 text-sm placeholder-gray-400 focus:outline-none"
              />

              {isSearching && (
                <BiLoaderCircle className="mr-2 animate-spin" size={22} />
              )}

              {items.length > 0 && (
                <div className="absolute bg-white max-w-[910px] h-auto w-full z-20 left-0 top-12 border p-1">
                  {items.map((item) => (
                    <div className="p-1" key={item.id}>
                      <Link
                        href={`/product/${item?.id}`}
                        className="flex items-center justify-between w-full p-1 px-2 cursor-pointer hover:bg-gray-200"
                      >
                        <div className="flex items-center">
                          <img
                            className="rounded-md"
                            width={"40"}
                            src={item?.url + "/40"}
                          />
                          <div className="ml-2 truncate">{item.title}</div>
                        </div>

                        <p className="truncate">
                          £{(item?.price / 100).toFixed(2)}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button className="flex items-center bg-blue-600 text-sm font-semibold text-white p-[11px] ml-2 px-14">
              Search
            </button>

            <div className="px-2 text-xs cursor-pointer hover:text-blue-500">
              Advanced
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
