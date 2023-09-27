"use client";
import { Section } from "@components/Section";
import { useQuery } from "@tanstack/react-query";
import { Card, Title, DonutChart } from "@tremor/react";
import axios from "axios";

const valueFormatter = (number: number) => `$ ${Intl.NumberFormat("us").format(number).toString()}`;

const Dashboard = () => {
    const infoQuery = useQuery({
        queryKey: ["/applications/stats"],
        queryFn: () =>
          axios
            .get("/applications/TUM.ai%20Application%20WS23/stats")
            .then((res) => res.data.data) 
      });
    return (
      <Section>
        <Card className="max-w-lg">
            <Title>Data Revenue</Title>
            <DonutChart
                className="mt-6"
                data={infoQuery.data}
                category="count"
                index="name"
                colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]} />
        </Card>
      </Section> 
    );
};

export default Dashboard;
