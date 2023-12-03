"use client"
import OpportunityCard from "./components/opportunityCard";
import { useState } from "react";
import {Opportunity} from "@models/opportunity";
import {Button} from "@components/ui/button";
export default function Main() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([
        {
            id:1,
            title:"Membership WS23/SS24",
            description:"Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.",
            date: "24/11/2024 - 24/01/2025",
            participants: 200
        },
        {
            id:2,
            title:"Membership WS23/SS24",
            description:"Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.",
            date: "24/11/2024 - 24/01/2025",
            participants: 200
        },
        {
            id:3,
            title:"Membership WS23/SS24",
            description:"Typography is the art and technique of arranging type to make written language legible, readable and appealing when displayed.",
            date: "24/11/2024 - 24/01/2025",
            participants: 200
        },
    ])

    return (
        <div className="flex flex-col gap-4 w-3/4 m-auto">
            <div className="flex justify-between">
                <h1 className="font-thin text-4xl">Opportunities</h1>
                <Button>Create Opportunity</Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
                {opportunities?.map((item,index)=>{
                    return (
                        <OpportunityCard
                            key={index}
                            title={item.title}
                            description={item.description}
                            date={item.date}
                            participants={item.participants}
                        />
                    )
                })}
            </div>
        </div>
    );
}
