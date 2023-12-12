"use client"
import { AreaChart, Card, Title } from "@tremor/react";
import React from "react";

export const AreaGraph = (props:any) => {
    const mockData = [
        {
            date: "Jan 22",
            "Applicants Processed": 10,
            "Total Applicants": 20,
        },
        {
            date: "Feb 22",
            "Applicants Processed": 15,
            "Total Applicants": 30,
        },
        {
            date: "Mar 22",
            "Applicants Processed": 19,
            "Total Applicants": 40,
        },
        {
            date: "Apr 22",
            "Applicants Processed": 30,
            "Total Applicants": 50,
        },
        {
            date: "May 22",
            "Applicants Processed": 45,
            "Total Applicants": 60,
        },
        {
            date: "Jun 22",
            "Applicants Processed": 50,
            "Total Applicants": 70,
        },
    ];

    return (
        <Card>
            <Title>Growth Data of ID:  {props.id}</Title>
            <AreaChart
                className="h-72 mt-4"
                data={mockData}
                index="date"
                categories={["Applicants Processed", "Total Applicants"]}
                colors={["indigo", "cyan"]}
            />
        </Card>
    );
};