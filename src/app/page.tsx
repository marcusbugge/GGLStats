"use client";

import { useState } from "react";
import Navbar from "./components/Navbar";
import Eks from "./Eks";
import Footer from "./components/Footer";
import Script from "next/script";

type SortPreference =
  | "Player"
  | "Champion"
  | "Standings"
  | "Team Scouter"
  | "Ladder";

export default function Home() {
  const [navSort, setNavSort] = useState("Overall");
  const [sortPreference, setSortPreference] =
    useState<SortPreference>("Player");

  const [viewPreference, setViewPreference] =
    useState<SortPreference>("Player");
  const handleSortOptionClick = (option: SortPreference) => {
    setSortPreference(option);
    setViewPreference(option);
  };

  return (
    <main>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="my-script" strategy="lazyOnload">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>

      <div className="page-cnt">
        <Navbar
          navSort={navSort}
          setNavSort={setNavSort}
          setSortPreference={setSortPreference}
          handleSortOptionClick={handleSortOptionClick}
        />
        <Eks
          navSort={navSort}
          setNavSort={setNavSort}
          setSortPreference={setSortPreference}
          viewPreference={viewPreference}
        />
      </div>
      <Footer />
    </main>
  );
}
