import { DataTable } from "./components/DataTable";
import { RowUser } from "./components/DataTableTypes";
import db from "server/db";
import { DepartmentRole, SpaceRole } from "@prisma/client";
import { getServerAuthSession } from "server/auth";
import { redirect } from "next/navigation";
import Breadcrumbs from "@components/ui/breadcrumbs";

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

  return (
    <div className="space-y-8 p-8">
      <div className="flex flex-col gap-3">
        <Breadcrumbs title="Members" />
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Members list
        </h1>
        <p className="text-muted-foreground">Manage and list members</p>
      </div>
      <DataTable rowData={profiles} columnData={columnData}></DataTable>
    </div>
  );
}
