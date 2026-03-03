// components/projects/ProjectList.tsx
// Grid of project cards with new project button

import type { ProjectWithChildren } from '@/hooks/useProject';
import ProjectCard from '@/components/projects/ProjectCard';
import EmptyState from '@/components/shared/EmptyState';

interface ProjectListProps {
  projects: ProjectWithChildren[];
  onSelect: (id: string) => void;
}

export default function ProjectList({ projects, onSelect }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <EmptyState
        title="Nenhum projeto"
        description="Crie projetos com #type_project no input"
      />
    );
  }

  // Separate active vs completed
  const active = projects.filter((p) => !p.project.completed);
  const completed = projects.filter((p) => p.project.completed);

  return (
    <div className="flex flex-col gap-4">
      {/* Active projects */}
      {active.length > 0 && (
        <div className="flex flex-col gap-3">
          {active.map((p) => (
            <ProjectCard
              key={p.project.id}
              data={p}
              onClick={() => onSelect(p.project.id)}
            />
          ))}
        </div>
      )}

      {/* Completed projects */}
      {completed.length > 0 && (
        <div className="flex flex-col gap-2">
          <span
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '10px',
              fontWeight: 600,
              color: '#8a9e7a60',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              padding: '8px 4px 0',
            }}
          >
            Concluídos
          </span>
          {completed.map((p) => (
            <ProjectCard
              key={p.project.id}
              data={p}
              onClick={() => onSelect(p.project.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
