
interface PageHeaderProps {
  title: string;
  description: string;
  isAuthenticated?: boolean;
}

export function PageHeader({ title, description, isAuthenticated = true }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted-foreground mt-2">
        {isAuthenticated ? description : "Please login to access this feature"}
      </p>
    </div>
  );
}
