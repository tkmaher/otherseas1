import data from "@/data/items.json";
import Main from "@/components/main";
import { Suspense } from "react";

export default function Home() {

  return (
    <Suspense fallback={<div style={{margin: "auto"}}>otherseas1.com: loading...</div>}>
      <Main data={data}/>
    </Suspense>
  );
}
