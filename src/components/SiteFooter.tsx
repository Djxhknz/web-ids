import { GITHUB_URL } from "@/lib/github";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
      Want to edit or improve the lists?{" "}
      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noreferrer"
        className="font-medium text-primary hover:underline"
      >
        Contribute on GitHub
      </a>
    </footer>
  );
}
