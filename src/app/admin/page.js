"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Flex, Separator, TextField } from "@radix-ui/themes";
import { useSession } from "next-auth/react";
import LeftNav from "@/components/common/LeftNav";
import AppHeader from "@/components/common/AppHeader";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X, SquareArrowOutUpRight, Trash2, SquarePen, Search } from "lucide-react";
import { useToast } from "@/provider/ToastContext";
import { useAlert } from "@/provider/AlertContext";

const emptyForm = {
  name: "",
  desc: "",
  keywords: "",
  url: "",
  thumbnail: null,
};

function ProjectCard({ project, onEdit, onDelete }) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
      <div className="relative w-full h-40 bg-gray-100">
        {project.project_thumbnail && (
          <img
            src={project.project_thumbnail}
            alt={project.project_name}
            className="object-cover w-full h-40 rounded-lg"
          />
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">
          {project.project_name}
        </h3>

        {project.project_desc && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {project.project_desc}
          </p>
        )}

        {project.project_keywords && (
          <div className="mt-2 flex flex-wrap gap-1">
            {project.project_keywords.split(",").map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
              >
                {kw.trim().toUpperCase()}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-2">
          Added:{" "}
          {new Date(project.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="absolute right-2 bottom-2 flex space-x-2">
        {project.project_url && (
          <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <SquareArrowOutUpRight className="h-5 w-5 text-blue-600" />
          </a>
        )}

        <button
          onClick={() => onEdit(project)}
          title="Edit project"
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <SquarePen className="h-5 w-5 text-green-600" />
        </button>

        <button
          onClick={() => onDelete(project)}
          title="Delete project"
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <Trash2 className="h-5 w-5 text-red-600" />
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { status } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();
  const { confirmAlert } = useAlert();

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      showToast("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingProject(null);
  };

  const handleDialogChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) resetForm();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setForm({
      name: project.project_name || "",
      desc: project.project_desc || "",
      keywords: project.project_keywords || "",
      url: project.project_url || "",
      thumbnail: null,
    });
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      showToast("Please enter a project name.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("project_name", form.name.trim());
      formData.append("project_desc", form.desc || "");
      formData.append("project_keywords", form.keywords || "");
      formData.append("project_url", form.url || "");
      if (form.thumbnail) {
        formData.append("project_thumbnail", form.thumbnail);
      }

      const isEdit = Boolean(editingProject);
      const url = isEdit
        ? `/api/projects/${editingProject.id}`
        : "/api/projects";

      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast(isEdit ? "Project updated successfully!" : "Project created successfully!");
        fetchProjects();
        resetForm();
        setOpen(false);
      } else {
        showToast(data.message || data.error || `Failed to ${isEdit ? "update" : "create"} project.`);
      }
    } catch (err) {
      console.error("Error saving project:", err);
      showToast("Error saving project.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (project) => {
    confirmAlert(`Delete project "${project.project_name}"?`, async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          showToast("Project deleted successfully!");
          setProjects((prev) => prev.filter((p) => p.id !== project.id));
        } else {
          showToast(data.message || "Failed to delete project.");
        }
      } catch (err) {
        console.error("Error deleting project:", err);
        showToast("Error deleting project.");
      } finally {
        setLoading(false);
      }
    });
  };

  if (status === "loading") return <p>Loading session...</p>;

  const filteredProjects = projects.filter((p) => {
    const search = searchTerm.toLowerCase();
    return (
      p.project_name?.toLowerCase().includes(search) ||
      p.project_desc?.toLowerCase().includes(search) ||
      p.project_keywords?.toLowerCase().includes(search)
    );
  });

  const thumbnailPreview = form.thumbnail
    ? URL.createObjectURL(form.thumbnail)
    : editingProject?.project_thumbnail || null;

  return (
    <>
      <AppHeader />
      <Flex height="100vh" pt="49px" align="stretch">
        <Box>
          <LeftNav />
        </Box>
        <Separator orientation="vertical" size="4" />

        <Box className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              Projects {projects.length > 0 && `(${projects.length})`}
            </h1>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <TextField.Root
                size="3"
                radius="full"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-72 bg-white"
              >
                <TextField.Slot side="left">
                  <Search className="h-4 w-4 text-gray-500" />
                </TextField.Slot>
              </TextField.Root>

              <Dialog.Root open={open} onOpenChange={handleDialogChange}>
                <Dialog.Trigger asChild>
                  <button className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition whitespace-nowrap">
                    <PlusCircle className="h-5 w-5" /> Add Project
                  </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-3">
                      <Dialog.Title className="text-lg font-semibold">
                        {editingProject ? "Edit Project" : "Add New Project"}
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button>
                          <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Project Title
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter project title"
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          name="desc"
                          value={form.desc || ""}
                          onChange={handleChange}
                          rows="3"
                          placeholder="Briefly describe this project"
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Keywords
                        </label>
                        <input
                          type="text"
                          name="keywords"
                          value={form.keywords || ""}
                          onChange={handleChange}
                          placeholder="e.g. water, GIS, dashboard, WaPOR"
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Separate multiple keywords with commas
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Project URL
                        </label>
                        <input
                          type="url"
                          name="url"
                          value={form.url || ""}
                          onChange={handleChange}
                          placeholder="https://your-dashboard-link"
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Thumbnail Image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          name="thumbnail"
                          onChange={(e) =>
                            setForm((prev) => ({
                              ...prev,
                              thumbnail: e.target.files[0] || null,
                            }))
                          }
                          className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                        />
                        {editingProject && !form.thumbnail && (
                          <p className="text-xs text-gray-400 mt-1">
                            Leave empty to keep the current thumbnail
                          </p>
                        )}
                        {thumbnailPreview && (
                          <img
                            src={thumbnailPreview}
                            alt="Preview"
                            className="mt-2 w-full h-32 object-cover rounded-lg border"
                          />
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                      <Dialog.Close asChild>
                        <button className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                          Cancel
                        </button>
                      </Dialog.Close>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
                      >
                        {submitting
                          ? editingProject
                            ? "Saving..."
                            : "Creating..."
                          : editingProject
                            ? "Save Changes"
                            : "Create"}
                      </button>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading projects...</p>
          ) : filteredProjects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredProjects.map((p) => (
                <ProjectCard
                  key={p?.id}
                  project={p}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-500">
              {searchTerm ? "No projects match your search." : "No project yet."}
            </div>
          )}
        </Box>
      </Flex>
    </>
  );
}
