"use client";

import { ItemType } from "@/types";
import { useState } from "react";
import { colors } from "@/types"
import { Table } from "./table";
import { AnimatePresence, motion } from "motion/react";


export default function Main({ data }: { data: ItemType[] }) {

    const categorized = data.reduce<Record<string, ItemType[]>>((acc, item, i) => {
        item.color = colors[i % colors.length];
        if (item.tags) item.tags?.sort();
        (acc[item.category] ??= []).push(item);
        return acc;
    }, {});

    Object.values(categorized).forEach(arr => arr.sort((a, b) => b.date.localeCompare(a.date)));

    const order = ["CV", "Education", "Music", "Writing", "Links", "Appendix"];

    const [chosen, setChosen] = useState("#ffffff");

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key="table"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ width: "100%", height: "100%" }}
            >
                <div className="content-left" style={{ backgroundColor: chosen }}>
                        <div className="header">
                            <b>Tom Maher</b> is a freelance web developer and sound artist based in Chicago,
                            Illinois. His research concerns history, noise, and signification. His studio is
                            located at{" "}
                            <a href="https://health-and-recreation.com" target="_blank">
                                health-and-recreation.com
                            </a>.
                        </div>
                        <div className="table-scroll">
                            {order.map((name) =>
                                <div key={name}>
                                    {categorized[name] && (
                                        <Table
                                            data={categorized[name]}
                                            title={name}
                                        />
                                    )}
                                    <br />
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="footer">
                        {colors.map((val, index) =>
                            <a
                                className="color-block"
                                style={{ backgroundColor: val }}
                                key={index}
                                onClick={() => setChosen(val)}
                            />
                        )}
                    </div>
            </motion.div>
        </AnimatePresence>
    );
}