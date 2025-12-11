import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();

  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "", // ETH numeric string like "0.5"
    deadline: "",
    category: "",
    location: "",
    image: "",
  });

  const [imageValid, setImageValid] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const isFormComplete = useMemo(() => {
    const { name, title, description, target, deadline, category, location, image } = form;
    return !!(name && title && description && target && deadline && category && location && image);
  }, [form]);

  const handleFormFieldChange = (fieldName, e) => {
    setForm((prev) => ({ ...prev, [fieldName]: e.target.value }));
    if (fieldName === "image") setImageValid(true);
    if (errorMsg) setErrorMsg("");
  };

  const validateForm = () => {
    const { name, title, description, target, deadline, category, location, image } = form;
    if (!name || !title || !description || !target || !deadline || !category || !location || !image) {
      setErrorMsg("Please fill all required fields.");
      return false;
    }

    const t = Number(form.target);
    if (Number.isNaN(t) || t <= 0) {
      setErrorMsg("Target must be a positive number (ETH).");
      return false;
    }

    const dl = new Date(form.deadline);
    if (!(dl instanceof Date) || isNaN(dl)) {
      setErrorMsg("Please provide a valid deadline date.");
      return false;
    }
    if (dl <= new Date()) {
      setErrorMsg("Deadline must be a future date.");
      return false;
    }

    setErrorMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateForm()) return;

    checkIfImage(form.image, async (exists) => {
      if (!exists) {
        setImageValid(false);
        setErrorMsg("Image URL is not reachable or invalid.");
        return;
      }

      try {
        setIsLoading(true);

        let targetWei;
        try {
          targetWei = ethers.utils.parseUnits(String(form.target), 18);
        } catch (parseErr) {
          setErrorMsg("Invalid target amount. Use a numeric ETH value (e.g. 0.5).");
          setIsLoading(false);
          return;
        }

        const payload = {
          ...form,
          target: targetWei.toString(),
        };

        await createCampaign(payload);

        setIsLoading(false);
        navigate("/crowd-funding");
      } catch (err) {
        console.error("createCampaign error:", err);
        setErrorMsg(err?.message || "Failed to create campaign.");
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="h-screen box-border overflow-hidden flex items-start justify-center py-8 px-4">
      {isLoading && <Loader />}

      <div className="w-full max-w-7xl h-full flex gap-6 items-start">
        {/* LEFT: Form panel (scrolls internally if needed) */}
        <div className="lg:w-2/3 w-full min-h-0 bg-white/85 backdrop-blur-sm rounded-2xl box-border flex flex-col overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-5 border-b border-white/40">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-sky-400 flex items-center justify-center shadow-md">
              <img src={money} alt="money" className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-slate-900">Start a Campaign</h1>
              <p className="text-sm text-slate-600">Create a professional on-chain campaign — fast and secure.</p>
            </div>
          </div>

          {/* FORM: internal scroll area */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 min-h-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                labelName="Your Name *"
                placeholder="John Doe"
                inputType="text"
                value={form.name}
                handleChange={(e) => handleFormFieldChange("name", e)}
              />
              <FormField
                labelName="Campaign Title *"
                placeholder="Launch Solar Water Project"
                inputType="text"
                value={form.title}
                handleChange={(e) => handleFormFieldChange("title", e)}
              />
            </div>

            <FormField
              labelName="Story *"
              placeholder="Tell your story and milestones"
              isTextArea
              value={form.description}
              handleChange={(e) => handleFormFieldChange("description", e)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                labelName="Goal (ETH) *"
                placeholder="0.5"
                inputType="text"
                value={form.target}
                handleChange={(e) => handleFormFieldChange("target", e)}
              />
              <FormField
                labelName="End Date *"
                placeholder="Select end date"
                inputType="date"
                value={form.deadline}
                handleChange={(e) => handleFormFieldChange("deadline", e)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="category" className="mb-2 text-sm font-medium text-slate-700">
                  Campaign Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={(e) => handleFormFieldChange("category", e)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                >
                  <option value="">Select a category</option>
                  <option value="education">Education</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="environment">Environment</option>
                  <option value="technology">Technology</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <FormField
                labelName="Location *"
                placeholder="City, Country"
                inputType="text"
                value={form.location}
                handleChange={(e) => handleFormFieldChange("location", e)}
              />
            </div>

            <FormField
              labelName="Campaign Image URL *"
              placeholder="https://example.com/image.jpg"
              inputType="url"
              value={form.image}
              handleChange={(e) => handleFormFieldChange("image", e)}
            />

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between mt-2">
              <div className="min-w-0">
                {errorMsg && <div className="text-sm text-red-600">{errorMsg}</div>}
                {!imageValid && <div className="text-sm text-red-600">Image not reachable — try a different URL.</div>}
                <div className="text-xs text-slate-500 mt-1">All fields required. Target in ETH (no $ sign).</div>
              </div>

              <div className="flex-shrink-0">
                <CustomButton
                  btnType="submit"
                  title={isLoading ? "Submitting..." : "Submit Campaign"}
                  styles={`px-8 py-3 rounded-full text-lg font-semibold ${
                    isLoading
                      ? "bg-emerald-300 text-white cursor-wait"
                      : isFormComplete
                      ? "bg-gradient-to-r from-emerald-500 to-sky-500 text-white shadow-lg"
                      : "bg-slate-200 text-slate-600 cursor-not-allowed"
                  }`}
                  disabled={isLoading || !isFormComplete}
                />
              </div>
            </div>
          </form>
        </div>

        {/* RIGHT: Preview (constrained, no extra blank space) */}
        <aside className="lg:w-1/3 w-full bg-white/85 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 p-5 box-border flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Live Preview</h3>
            <div className="text-xs text-slate-500">Real-time</div>
          </div>

          <div className="rounded-xl border border-slate-100 overflow-hidden flex-1 flex flex-col">
            <div className="h-44 w-full bg-slate-100 flex items-center justify-center">
              {form.image ? (
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-slate-400">Image preview</div>
              )}
            </div>

            <div className="p-4 flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-md font-bold text-slate-900 leading-tight truncate">{form.title || "Campaign Title"}</h4>
                  <div className="text-xs text-slate-500 mt-1">{form.category || "Category"}</div>
                </div>

                <div className="text-right text-xs text-slate-500">
                  <div>{form.location || "Location"}</div>
                  <div className="mt-1">{form.deadline ? new Date(form.deadline).toLocaleDateString() : "Deadline"}</div>
                </div>
              </div>

              <p className="mt-1 text-sm text-slate-600 line-clamp-4">{form.description || "Short campaign description will show here."}</p>

              <div className="mt-auto flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-emerald-600">{form.target || "0"} ETH</div>
                  <div className="text-xs text-slate-500">Goal</div>
                </div>

                <div>
                  <button className="px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-400 text-white text-sm font-semibold shadow-sm">
                    View
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">Tip: images validated on submit. Use numeric ETH amounts (e.g., 0.5).</div>
        </aside>
      </div>
    </div>
  );
}
