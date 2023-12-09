"use client"
import DetailedInfoCard from "../components/DetailedInfoCard";
import {AreaGraph} from "@components/Graph/AreaGraph";
import Select from "@components/Select";
import {useState} from "react";
import ClickableInfoCard from "../components/ClickableInfoCard";
import {PersonIcon} from "@radix-ui/react-icons";
import { Card, CardFooter, CardHeader, CardContent } from "@components/ui/card";
import {Button} from "@components/ui/button"
export default function Dashboard({ params }) {
    const opportunityId = decodeURIComponent(params.opportunity_id);
    //TODO get data based of the id (possibly make a hook for this)
    const [selectedPhase, setSelectedPhase] = useState("SCREENING")
    return (
        <div className="flex flex-col gap-8 container">
            <div className="flex flex-col gap-4">
                <h1 className="font-thin text-6xl">Dashboard</h1>
                <p>ID: {opportunityId}</p>
                <p className="text-2xl mt-5">General Overview</p>

                <div className="grid grid-cols-3 gap-4">
                    <DetailedInfoCard title="Total Applicants" data={420} growthInPercent={10}>
                        <PersonIcon className="w-10 h-10"/>
                    </DetailedInfoCard>
                    <DetailedInfoCard title="Total Applicants" data={420} growthInPercent={10}>
                        <PersonIcon className="w-10 h-10"/>
                    </DetailedInfoCard>
                    <DetailedInfoCard title="Total Applicants" data={420} growthInPercent={10}>
                        <PersonIcon className="w-10 h-10"/>
                    </DetailedInfoCard>
                </div>

                <AreaGraph id={opportunityId}/>

                <div className="flex flex-col gap-4">
                    <p className="text-2xl mt-5">Overview of phases</p>
                    <div className="grid grid-cols-6 gap-4">
                        <Select
                            placeholder="From Type"
                            options={[
                                {
                                    key: "Screening",
                                    value: "SCREENING",
                                },
                                {
                                    key: "Interview",
                                    value: "INTERVIEW",
                                },
                            ]}
                            value={selectedPhase}
                            setSelectedItem={(item:string)=>{setSelectedPhase(item)}}
                        />
                        <Button className="col-start-6">Visit</Button>
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-1 flex flex-col gap-4">
                            <ClickableInfoCard data={30} description={"Screeners"} dark={true}/>
                            <ClickableInfoCard data={30} description={"Screeners"}/>
                        </div>
                        <div className="col-span-5">
                            <Card className="h-full"/>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
}
