import db from "server/db";
import { Chart } from "./chart";

export const ApplicantFlowChart = async ({
  opportunityId,
}: {
  opportunityId: number;
}) => {
  const questionnaires = (
    await db.questionnaire.findMany({
      where: { phase: { opportunityId } },
      include: {
        phase: true,
        _count: {
          select: {
            applications: true,
          },
        },
      },
    })
  ).map((q, idx) => ({
    ...q,
    idx,
    order: q.phase.order,
    count: q._count.applications,
  }));

  const data = {
    nodes: questionnaires.map((q) => ({ name: `${q.phase.name}-${q.name}` })),
    links: questionnaires.flatMap((a) =>
      questionnaires
        .filter((b) => b.order === a.order + 1)
        .map((b) => ({ source: a.idx, target: b.idx, value: b.count })),
    ),
  };

  return <Chart data={data} />;
};
