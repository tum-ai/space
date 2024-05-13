import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function Breadcrumbs({ title }: { title: string }) {
  const paths = usePathname().split("/").filter(Boolean).slice(0, -1);
  const pathParams = useParams();

  console.log("pathParams", pathParams);
  console.log("paths", paths);

  // next doesnt expose the static path in the pathname
  // we therefore have to match it manually
  if (paths.includes("opportunities")) {
    const opportunityIndex = paths.indexOf("opportunities");
    const opportunityId = paths[opportunityIndex + 1];
    if (opportunityId && !isNaN(Number(opportunityId))) {
      // remove the id from the path
      paths.splice(opportunityIndex + 1, 1);
    }
  }

  return (
    <nav className="flex items-center space-x-1">
      <Link href="/">
        <div className="text-muted-foreground">Home</div>
      </Link>
      {paths.map((path, index) => (
        <div key={index} className="flex items-center">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Link href={`/${path}`}>
            <div className="text-muted-foreground">
              {path.slice(0, 1).toUpperCase() + path.slice(1)}
            </div>
          </Link>
        </div>
      ))}
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
      <span className="text-muted-foreground">{title}</span>
    </nav>
  );
}
