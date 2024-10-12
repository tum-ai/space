import { DataTable } from "./components/DataTable";
import { type RowUser } from "./components/DataTableTypes";
import db from "server/db";
import { DepartmentRole, SpaceRole } from "@prisma/client";
import { getServerAuthSession } from "server/auth";
import { redirect } from "next/navigation";
import { PageHeading } from "@components/ui/page-heading";
import { headers } from "next/headers";
import { mapPathnameToBreadcrumbs } from "@components/ui/page-breadcrumbs";

export default async function MembersPage() {
  const session = await getServerAuthSession();
  const userId = session?.user.id;
  if (!userId) redirect("/auth");

  const users = await db.user.findMany({
    include: {
      departmentMemberships: {
        include: {
          department: true,
        },
      },
    },
  });

  const profiles: RowUser[] = users.map((user) => {
    return {
      id: user.id,
      name: user.name ?? "",
      email: user.email,
      roles: user.roles,
      image: user.image ?? undefined,
      currentDepartment: user.departmentMemberships[0]?.department?.name ?? "",
      currentDepartmentPosition: user.departmentMemberships[0]?.role ?? "",
    };
  });

  const departments = await db.department.findMany().then((departments) => {
    return departments.map((department) => ({
      label: department.name,
      value: department.name,
    }));
  });

  const roles = Object.entries(SpaceRole).map((role) => ({
    label:
      role[1].charAt(0) + role[1].slice(1).toLowerCase().replaceAll("_", " "),
    value: role[1],
  }));

  const positions = Object.entries(DepartmentRole).map((position) => ({
    label:
      position[1].charAt(0) +
      position[1].slice(1).toLowerCase().replaceAll("_", " "),
    value: position[1],
  }));

  const columnData = {
    departments: departments,
    roles: roles,
    positions: positions,
  };

  const headerList = headers();
  const breadcrumbs = await mapPathnameToBreadcrumbs(headerList);

  return (
    <section className="space-y-8 py-8">
      <PageHeading
        title="Members"
        description="Manage and list members"
        breadcrumbs={breadcrumbs}
      />

      <DataTable rowData={profiles} columnData={columnData} />
    </section>
  );
}
