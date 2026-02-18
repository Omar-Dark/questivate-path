import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
  useExternalRoadmaps,
  useCreateRoadmap,
  useUpdateRoadmap,
  useDeleteRoadmap,
  useRoadmapSections,
  useCreateSection,
  useUpdateSection,
  useDeleteSection,
  useSectionResources,
  useCreateResource,
  useUpdateResource,
  useDeleteResource,
} from '@/hooks/useExternalApi';
import { ExternalRoadmap, ExternalSection, ExternalResource } from '@/lib/externalApi';
import { Loader2, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Link as LinkIcon, Video, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

const dummyRoadmaps = [
  {
    _id: 'dr1',
    title: 'Frontend Development',
    description: 'Master modern frontend technologies from HTML/CSS to React and beyond.',
    sections: [
      { _id: 'ds1', title: 'HTML & CSS Basics', description: 'Learn the building blocks of the web', difficulty: 'Beginner', resources: [] },
      { _id: 'ds2', title: 'JavaScript Fundamentals', description: 'Core JS concepts and ES6+', difficulty: 'Beginner', resources: [] },
    ],
  },
  {
    _id: 'dr2',
    title: 'Backend Development',
    description: 'Build robust server-side applications with Node.js, databases, and APIs.',
    sections: [
      { _id: 'ds3', title: 'Node.js Basics', description: 'Server-side JavaScript', difficulty: 'Intermediate', resources: [] },
    ],
  },
  {
    _id: 'dr3',
    title: 'Data Science',
    description: 'Explore data analysis, machine learning, and statistical modeling.',
    sections: [],
  },
];

// ======== Roadmap Form ========
const RoadmapForm = ({ initial, onSubmit, onCancel }: {
  initial?: { title: string; description: string };
  onSubmit: (data: { title: string; description: string }) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Roadmap title" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Roadmap description" />
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="gradient-primary text-white border-0" onClick={() => onSubmit({ title, description })}>
          {initial ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

// ======== Section Form ========
const SectionForm = ({ initial, onSubmit, onCancel }: {
  initial?: { title: string; description: string; difficulty?: string };
  onSubmit: (data: { title: string; description: string; difficulty?: string }) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [difficulty, setDifficulty] = useState(initial?.difficulty || 'Beginner');
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Section title" />
      </div>
      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Section description" />
      </div>
      <div className="space-y-2">
        <Label>Difficulty</Label>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="Beginner">Beginner</SelectItem>
            <SelectItem value="Intermediate">Intermediate</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="gradient-primary text-white border-0" onClick={() => onSubmit({ title, description, difficulty })}>
          {initial ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

// ======== Resource Form ========
const ResourceForm = ({ initial, onSubmit, onCancel }: {
  initial?: { title: string; url: string; type: string };
  onSubmit: (data: { title: string; url: string; type: string }) => void;
  onCancel: () => void;
}) => {
  const [title, setTitle] = useState(initial?.title || '');
  const [url, setUrl] = useState(initial?.url || '');
  const [type, setType] = useState(initial?.type || 'article');
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" />
      </div>
      <div className="space-y-2">
        <Label>URL</Label>
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." />
      </div>
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="article">Article</SelectItem>
            <SelectItem value="video">Video</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button className="gradient-primary text-white border-0" onClick={() => onSubmit({ title, url, type })}>
          {initial ? 'Update' : 'Create'}
        </Button>
      </div>
    </div>
  );
};

// ======== Section Resources Sub-Panel ========
const SectionResources = ({ sectionId }: { sectionId: string }) => {
  const { data: resources, isLoading, refetch } = useSectionResources(sectionId);
  const createResource = useCreateResource();
  const updateResource = useUpdateResource();
  const deleteResource = useDeleteResource();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExternalResource | null>(null);

  if (isLoading) return <Loader2 className="h-4 w-4 animate-spin text-primary mx-auto" />;

  return (
    <div className="space-y-2 pl-4 border-l-2 border-border/50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">Resources</p>
        <Button variant="ghost" size="sm" onClick={() => { setShowForm(true); setEditing(null); }}>
          <Plus className="h-3 w-3 mr-1" /> Add
        </Button>
      </div>

      {(showForm || editing) && (
        <Card className="p-4 bg-muted/30">
          <ResourceForm
            initial={editing ? { title: editing.title, url: editing.url, type: editing.type } : undefined}
            onSubmit={(data) => {
              if (editing) {
                updateResource.mutate({ resourceId: editing._id, updates: data as any }, {
                  onSuccess: () => { toast.success('Resource updated'); setEditing(null); refetch(); },
                  onError: () => toast.error('Failed to update'),
                });
              } else {
                createResource.mutate({ sectionId, data }, {
                  onSuccess: () => { toast.success('Resource created'); setShowForm(false); refetch(); },
                  onError: () => toast.error('Failed to create'),
                });
              }
            }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </Card>
      )}

      {resources?.map((r) => (
        <div key={r._id} className="flex items-center justify-between p-2 rounded-lg bg-muted/20 text-sm">
          <div className="flex items-center gap-2 min-w-0">
            {r.type === 'video' ? <Video className="h-3.5 w-3.5 text-primary shrink-0" /> : <FileText className="h-3.5 w-3.5 text-primary shrink-0" />}
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="truncate hover:text-primary transition-colors">{r.title}</a>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(r)}><Pencil className="h-3 w-3" /></Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() =>
              deleteResource.mutate(r._id, {
                onSuccess: () => { toast.success('Resource deleted'); refetch(); },
                onError: () => toast.error('Failed to delete'),
              })
            }><Trash2 className="h-3 w-3" /></Button>
          </div>
        </div>
      ))}
      {!resources?.length && !showForm && (
        <p className="text-xs text-muted-foreground italic">No resources yet</p>
      )}
    </div>
  );
};

// ======== Sections Panel for a Roadmap ========
const RoadmapSections = ({ roadmapId }: { roadmapId: string }) => {
  const { data: sections, isLoading, refetch } = useRoadmapSections(roadmapId);
  const createSection = useCreateSection();
  const updateSection = useUpdateSection();
  const deleteSection = useDeleteSection();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExternalSection | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  if (isLoading) return <Loader2 className="h-5 w-5 animate-spin text-primary mx-auto my-4" />;

  return (
    <div className="space-y-3 mt-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">Sections</p>
        <Button variant="outline" size="sm" onClick={() => { setShowForm(true); setEditing(null); }}>
          <Plus className="h-3 w-3 mr-1" /> Add Section
        </Button>
      </div>

      {(showForm || editing) && (
        <Card className="p-4 glass-surface">
          <SectionForm
            initial={editing ? { title: editing.title, description: editing.description, difficulty: editing.difficulty } : undefined}
            onSubmit={(data) => {
              if (editing) {
                updateSection.mutate({ sectionId: editing._id, updates: data as any }, {
                  onSuccess: () => { toast.success('Section updated'); setEditing(null); refetch(); },
                  onError: () => toast.error('Failed to update'),
                });
              } else {
                createSection.mutate({ roadmapId, data }, {
                  onSuccess: () => { toast.success('Section created'); setShowForm(false); refetch(); },
                  onError: () => toast.error('Failed to create'),
                });
              }
            }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </Card>
      )}

      {sections?.map((s) => (
        <Collapsible
          key={s._id}
          open={expandedSection === s._id}
          onOpenChange={(open) => setExpandedSection(open ? s._id : null)}
        >
          <div className="rounded-lg border border-border/50 bg-card/50 overflow-hidden">
            <div className="flex items-center justify-between p-3">
              <CollapsibleTrigger asChild>
                <button className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors text-left flex-1">
                  {expandedSection === s._id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  {s.title}
                  <Badge variant="outline" className="text-xs">{s.difficulty}</Badge>
                </button>
              </CollapsibleTrigger>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setEditing(s)}><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() =>
                  deleteSection.mutate(s._id, {
                    onSuccess: () => { toast.success('Section deleted'); refetch(); },
                    onError: () => toast.error('Failed to delete'),
                  })
                }><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
            <CollapsibleContent className="p-3 pt-0 space-y-2">
              <p className="text-xs text-muted-foreground">{s.description}</p>
              <SectionResources sectionId={s._id} />
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
      {!sections?.length && !showForm && (
        <p className="text-sm text-muted-foreground italic text-center py-4">No sections yet</p>
      )}
    </div>
  );
};

// ======== Main AdminRoadmaps ========
export const AdminRoadmaps = () => {
  const { data: apiRoadmaps, isLoading, refetch } = useExternalRoadmaps();
  const createRoadmap = useCreateRoadmap();
  const updateRoadmap = useUpdateRoadmap();
  const deleteRoadmap = useDeleteRoadmap();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<ExternalRoadmap | null>(null);
  const [expandedRoadmap, setExpandedRoadmap] = useState<string | null>(null);

  const roadmaps = apiRoadmaps?.length ? apiRoadmaps : dummyRoadmaps as any[];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Roadmaps</h2>
        <Button className="gradient-primary text-white border-0" onClick={() => { setShowForm(true); setEditing(null); }}>
          <Plus className="h-4 w-4 mr-2" /> New Roadmap
        </Button>
      </div>

      {(showForm || editing) && (
        <Card className="glass-card p-6">
          <h3 className="text-lg font-medium mb-4">{editing ? 'Edit Roadmap' : 'Create Roadmap'}</h3>
          <RoadmapForm
            initial={editing ? { title: editing.title, description: editing.description } : undefined}
            onSubmit={(data) => {
              if (editing) {
                updateRoadmap.mutate({ id: editing._id, updates: data }, {
                  onSuccess: () => { toast.success('Roadmap updated'); setEditing(null); refetch(); },
                  onError: () => toast.error('Failed to update'),
                });
              } else {
                createRoadmap.mutate(data, {
                  onSuccess: () => { toast.success('Roadmap created'); setShowForm(false); refetch(); },
                  onError: () => toast.error('Failed to create'),
                });
              }
            }}
            onCancel={() => { setShowForm(false); setEditing(null); }}
          />
        </Card>
      )}

      <div className="space-y-3">
        {roadmaps?.map((r) => (
          <Collapsible
            key={r._id}
            open={expandedRoadmap === r._id}
            onOpenChange={(open) => setExpandedRoadmap(open ? r._id : null)}
          >
            <Card className="glass-card overflow-hidden">
              <div className="flex items-center justify-between p-4">
                <CollapsibleTrigger asChild>
                  <button className="flex items-center gap-2 font-medium hover:text-primary transition-colors text-left flex-1">
                    {expandedRoadmap === r._id ? <ChevronDown className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                    {r.title}
                    <Badge variant="outline" className="text-xs ml-2">
                      {Array.isArray(r.sections) ? r.sections.length : 0} sections
                    </Badge>
                  </button>
                </CollapsibleTrigger>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() =>
                    deleteRoadmap.mutate(r._id, {
                      onSuccess: () => { toast.success('Roadmap deleted'); refetch(); },
                      onError: () => toast.error('Failed to delete'),
                    })
                  }><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
              <CollapsibleContent className="px-4 pb-4">
                <p className="text-sm text-muted-foreground mb-3">{r.description}</p>
                <RoadmapSections roadmapId={r._id} />
              </CollapsibleContent>
            </Card>
          </Collapsible>
        ))}
      </div>

      {!roadmaps?.length && !showForm && (
        <Card className="glass-card p-8 text-center text-muted-foreground">No roadmaps found</Card>
      )}
    </div>
  );
};
