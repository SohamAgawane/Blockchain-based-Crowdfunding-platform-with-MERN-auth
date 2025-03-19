import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

import { useStateContext } from "../context";
import { money } from "../assets";
import { CustomButton, FormField, Loader } from "../components";
import { checkIfImage } from "../utils";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { createCampaign } = useStateContext();
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    category:"",
    location:"",
    image: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setForm({ ...form, [fieldName]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form.target, 18),
        });
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Provide valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  return (
    <div className="flex justify-center text-black items-center">
      {isLoading && <Loader />}
      <div className="bg-white shadow-md bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-8 w-full max-w-2xl">
        <div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-green-400 rounded-[10px]">
          <h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">
            Start a Campaign 🚀
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mt-5 text-black">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              labelName="Your Name *"
              placeholder="John Doe"
              inputType="text"
              value={form.name}
              handleChange={(e) => handleFormFieldChange("name", e)}
            />
            <FormField
              labelName="Campaign Title *"
              placeholder="Write a title"
              inputType="text"
              value={form.title}
              handleChange={(e) => handleFormFieldChange("title", e)}
            />
          </div>

          <FormField
            labelName="Story *"
            placeholder="Write your story"
            isTextArea
            value={form.description}
            handleChange={(e) => handleFormFieldChange("description", e)}
          />

          <div className="flex items-center p-4 bg-green-200 rounded-lg">
            <img src={money} alt="money" className="w-12  h-12" />
            <p className="ml-4 text-green-700 font-medium">
              You will get 100% of the raised amount.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              labelName="Goal *"
              placeholder="ETH 0.50"
              inputType="text"
              value={form.target}
              handleChange={(e) => handleFormFieldChange("target", e)}
            />
            <FormField
              labelName="End Date *"
              placeholder="End Date"
              inputType="date"
              value={form.deadline}
              handleChange={(e) => handleFormFieldChange("deadline", e)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="mt-2">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Campaign Category *
            </label>
            <select
              id="category"
              name="category"
              className="mt-1 text-2xl block bg-transparent w-full p-4 border border-black rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              value={form.category}
              onChange={(e) => handleFormFieldChange("category", e)}
            >
              <option value="" disabled>
                Select a category
              </option>
              <option value="education">Education</option>
              <option value="healthcare">Healthcare</option>
              <option value="environment">Environment</option>
              <option value="technology">Technology</option>
              <option value="other">Other</option>
            </select>
            </div>
            <FormField
              labelName="Location *"
              placeholder="Location"
              inputType="text"
              value={form.location}
              handleChange={(e) => handleFormFieldChange("location", e)}
            />
          </div>

          <FormField
            labelName="Campaign Image *"
            placeholder="Place image URL of your campaign"
            inputType="url"
            value={form.image}
            handleChange={(e) => handleFormFieldChange("image", e)}
          />

          <div className="flex justify-center mt-6">
            <CustomButton
              btnType="submit"
              title="Submit Campaign"
              styles="bg-white border text-xl px-12 border-green-2 text-black px-6 py-3 rounded-lg hover:bg-green-700 hover:text-white transition"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCampaign;
