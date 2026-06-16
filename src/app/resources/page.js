"use client";

import { useEffect, useState, useCallback } from "react";
import { Box, Flex, Separator, TextField } from "@radix-ui/themes";
import { useSession } from "next-auth/react"; // ✅ get user info from NextAuth
import LeftNav from "@/components/common/LeftNav";
import AppHeader from "@/components/common/AppHeader";
import * as Dialog from "@radix-ui/react-dialog";
import { PlusCircle, X, SquareArrowOutUpRight, Trash2, Search } from "lucide-react";
import { useToast } from "@/provider/ToastContext";
import { useAlert } from "@/provider/AlertContext";


function ResourceCard({ resource, onDelete }) {
  return (
    <div className="relative rounded-2xl py-3 my-2 border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
      {/* Body */}

      {resource.resource_thumbnail && (
        <div className="relative w-full h-40 bg-gray-100">
          <a href={resource.resource_url} target="_blank" rel="noopener noreferrer">

            <img
              src={resource.resource_thumbnail}
              alt={resource.resource_name}
              className="object-cover w-full h-40 rounded-lg"
            />

          </a>
        </div>

      )}

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 ">
          {resource.resource_name}
        </h3>

        {resource.resource_desc && (
          <p className="text-sm text-gray-600 mt-2">
            {resource.resource_desc}
          </p>
        )}

        {resource.resource_keywords && (
          <div className="mt-2 flex flex-wrap gap-1">
            {resource.resource_keywords.split(",").map((kw, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full"
              >
                {kw.trim().toUpperCase()}
              </span>
            ))}
          </div>
        )}

        {/* <p className="text-xs text-gray-400 mt-2">
          Added:{" "}
          {new Date(resource.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p> */}
      </div>

      <div className="absolute right-2 bottom-2 flex space-x-2">
        <a
          href={resource.resource_url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <SquareArrowOutUpRight className="h-5 w-5 text-blue-600" />
        </a>

        <button
          onClick={() => onDelete(resource)}
          title="Delete resource"
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
        >
          <Trash2 className="h-5 w-5 text-red-600" />
        </button>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const { status } = useSession(); // ✅ get user from NextAuth
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    desc: "",
    keywords: "",
    url: "",
    thumbnail: null,
  });

  const { showToast } = useToast();
  const { confirmAlert } = useAlert();

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/resources", { cache: "no-store" });
      const data = await res.json();
      setResources(data.resources || []);
    } catch (err) {
      console.error("Error fetching resources:", err);
      showToast("Failed to fetch resources.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    if (!form.name.trim()) {
      showToast("Please enter a website/dashboard name.");
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("resource_name", form.name.trim());
      formData.append("resource_desc", form.desc || "");
      formData.append("resource_keywords", form.keywords || "");
      formData.append("resource_url", form.url || "");
      if (form.thumbnail) {
        formData.append("resource_thumbnail", form.thumbnail);
      }

      const res = await fetch("/api/resources", {
        method: "POST",
        body: formData, // ✅ Let the browser handle content-type
      });

      const data = await res.json();
      if (res.ok && data.success) {
        showToast("Resource created successfully!");
        fetchResources();
        setForm({ name: "", desc: "", keywords: "", url: "", thumbnail: null });
        setOpen(false);
      } else {
        showToast(data.error || "Failed to create resource.");
      }
    } catch (err) {
      console.error("Error creating resource:", err);
      showToast("Error creating resource.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (resource) => {
    confirmAlert(`Delete "${resource.resource_name}"?`, async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/resources/${resource.id}`, {
          method: "DELETE",
        });

        const data = await res.json();

        if (res.ok && data.success) {
          showToast("Resource deleted successfully!");
          setResources((prev) => prev.filter((r) => r.id !== resource.id));
        } else {
          showToast(data.message || "Failed to delete resource.");
        }
      } catch (err) {
        console.error("Error deleting resource:", err);
        showToast("Error deleting resource.");
      } finally {
        setLoading(false);
      }
    });
  };

  // Loading/unauthenticated state
  if (status === "loading") return <p>Loading session...</p>;

  const filteredResources = resources.filter((r) => {
    const search = searchTerm.toLowerCase();
    return (
      r.resource_name?.toLowerCase().includes(search) ||
      r.resource_desc?.toLowerCase().includes(search) ||
      r.resource_keywords?.toLowerCase().includes(search)
    );
  });

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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              External Websites & Dashboards{" "}
              {resources.length > 0 && `(${resources.length})`}
            </h1>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* 🔍 Search Bar */}
              <TextField.Root
                size="3"
                radius="full"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-80 bg-white"
              >
                <TextField.Slot side="left">
                  <Search className="h-4 w-4 text-gray-500" />
                </TextField.Slot>
              </TextField.Root>

              <Dialog.Root open={open} onOpenChange={setOpen}>
                <Dialog.Trigger asChild>
                  <button className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 transition whitespace-nowrap">
                    <PlusCircle className="h-5 w-5" /> Add
                  </button>
                </Dialog.Trigger>

                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-3">
                      <Dialog.Title className="text-lg font-semibold">
                        Add Website / Dashboard
                      </Dialog.Title>
                      <Dialog.Close asChild>
                        <button>
                          <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                        </button>
                      </Dialog.Close>
                    </div>

                    {/* FORM FIELDS */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Enter website/dashboard name"
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
                          placeholder="Briefly describe this resource"
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
                          placeholder="e.g. dashboard, GIS, reference"
                          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          Separate multiple keywords with commas
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          URL
                        </label>
                        <input
                          type="url"
                          name="url"
                          value={form.url || ""}
                          onChange={handleChange}
                          placeholder="https://example.com"
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
          </div>

          {loading ? (
            <p className="text-gray-500">Loading resources...</p>
          ) : filteredResources.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
              {[...filteredResources].map((r) => (
                <ResourceCard key={r?.id} resource={r} onDelete={handleDelete} />
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No resources yet.</div>
          )}
        </Box>
      </Flex>
    </>
  );
}
