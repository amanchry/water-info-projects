"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Box, Flex, Separator } from "@radix-ui/themes";
import { useSession } from "next-auth/react"; // ✅ get user info from NextAuth
import LeftNav from "@/components/common/LeftNav";
import AppHeader from "@/components/common/AppHeader";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X, Eye, SquareArrowOutUpRight, Trash2 } from "lucide-react";
import { useToast } from "@/provider/ToastContext";
import { useAlert } from "@/provider/AlertContext";
import { useRouter } from "next/navigation";


function ProjectCard({ project, onView, onDelete }) {
  return (
    <div className="relative rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
      {/* Header (actions) */}


      {/* Body */}
      <div className="relative w-full h-40 bg-gray-100">
        {project.project_thumbnail && (
          <img
  src={project.project_thumbnail}
  alt={project.project_name}
  className="object-cover w-full h-40 rounded-lg"
/>



          // <Image
          //   src={project.project_thumbnail}
          //   alt={project.project_name}
          //   fill
          //   className="object-cover"
          // />
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
        <a
            href={project.project_url}
            target="_blank"
            rel="noopener noreferrer"
             className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
 <SquareArrowOutUpRight className="h-5 w-5 text-blue-600" />
          </a>
        
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

export default function HomePage() {
  const { data: session, status } = useSession(); // ✅ get user from NextAuth
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    keywords: "",
    url: "",
    thumbnail: null,
  });


  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const { showToast } = useToast();
  const { confirmAlert } = useAlert();


  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/projects", { cache: "no-store" });
      const data = await res.json();
      console.log("data", data)
      setProjects(data.projects || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
      showToast("Failed to fetch projects.");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchProjects();  // no token needed
  }, [fetchProjects]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };



  const handleCreate = async () => {
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

      const res = await fetch("/api/projects", {
        method: "POST",
        body: formData, // ✅ Let the browser handle content-type
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Project created successfully!");
        fetchProjects();
        setForm({ name: "" });
        setOpen(false);
      } else {
        showToast(data.error || "Failed to create project.");
      }
    } catch (err) {
      console.error("Error creating project:", err);
      showToast("Error creating project.");
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


  // ✅ View project
  const handleView = (project) => {
    router.push(`/wagen/${project.id}`); // dynamic page
  };


  // Loading/unauthenticated state
  if (status === "loading") return <p>Loading session...</p>;


  return (
    <>
      <AppHeader />
      <Flex height="100vh" pt="49px" align="stretch">
        <Box>
          <LeftNav />
        </Box>
        <Separator orientation="vertical" size="4" />

        {/* ===== Main Content ===== */}
        <Box className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Projects {projects.length > 0 && `(${projects.length})`}
            </h1>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition">
                  <PlusCircle className="h-5 w-5" /> Add Project
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <Dialog.Title className="text-lg font-semibold">
                      Add New Project
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <button>
                        <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                      </button>
                    </Dialog.Close>
                  </div>

                  {/* FORM FIELDS */}
                  <div className="space-y-4">
                    {/* Project Title */}
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

                    {/* Project Description */}
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

                    {/* Keywords */}
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

                    {/* Project URL */}
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

                    {/* Thumbnail Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Thumbnail Image
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        name="thumbnail"
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, thumbnail: e.target.files[0] }))
                        }
                        className="mt-1 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                      />
                      {form.thumbnail && (
                        <img
                          src={URL.createObjectURL(form.thumbnail)}
                          alt="Preview"
                          className="mt-2 w-full h-32 object-cover rounded-lg border"
                        />
                      )}
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="mt-6 flex justify-end gap-2">
                    <Dialog.Close asChild>
                      <button className="rounded-lg border px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      onClick={handleCreate}
                      disabled={submitting}
                      className="rounded-lg bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {submitting ? "Creating..." : "Create"}
                    </button>
                  </div>
                </Dialog.Content>


              </Dialog.Portal>
            </Dialog.Root>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading projects...</p>
          ) : projects.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...projects].map((p) => (
                <ProjectCard
                  key={p?.id}
                  project={p}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No project yet.</div>
          )}
        </Box>
      </Flex>
    </>
  );
}
