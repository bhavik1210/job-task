
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { X } from "lucide-react";
import { Label } from "../ui/components/ui/label";
import { Input } from "../ui/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/components/ui/select";
import { Textarea } from "../ui/components/ui/textarea";
import { Button } from "../ui/components/ui/button";
import { Badge } from "../ui/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/components/ui/popover";
import { cn } from "../ui/lib/utils";
import { Calendar } from "../ui/components/ui/calendar";
import { Separator } from "../ui/components/ui/separator";
import axios from "axios";
import { backendurl } from "../server";
import swal from 'sweetalert';


export default function CreateJobForm() {
  const [requirements, setRequirements] = useState<string[]>([]);
  const [requirementInput, setRequirementInput] = useState("");
  const [postedDate, setPostedDate] = useState<Date | undefined>(new Date());

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    type: "",
    salary: "",
    description: "",
    category: "",
  });

  const handleAddRequirement = () => {
    if (requirementInput.trim() !== "") {
      setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput("");
    }
  };

  const handleRemoveRequirement = (index: number) => {
    const updated = [...requirements];
    updated.splice(index, 1);
    setRequirements(updated);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newJob = {
      ...formData,
      requirements,
      postedDate: postedDate ? format(postedDate, "yyyy-MM-dd") : "",
    };
    console.log(newJob);
    // send `newJob` to your backend here

    try {
        const response = await axios.post(`${backendurl}/jobs/create-new-job`, newJob,{
          withCredentials: true,
        }); // Your API route
        console.log("Job created successfully:", response.data);
        // Optional: Reset the form after successful submission
        setFormData({
          title: "",
          company: "",
          location: "",
          type: "",
          salary: "",
          description: "",
          category: "",
        });
        setRequirements([]);
        setRequirementInput("");
        setPostedDate(new Date());
        swal("Job created successfully!", `New Job post uplaoded `, "success");
      } catch (error) {
        console.error("Error creating job:", error);
        alert("Failed to create job. Please try again.");
      }
  };

  return (
    <div className="max-w-5xl mx-auto p-10 rounded-xl bg-white dark:bg-gray-900 shadow-md space-y-8 font-poppins">
      <h2 className="text-2xl font-bold">Create New Job</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid gap-4">
         
          <div>
            <Label>Title</Label>
            <Input name="title" value={formData.title} onChange={handleChange} placeholder="Job Title" />
          </div>
          <div>
            <Label>Company</Label>
            <Input name="company" value={formData.company} onChange={handleChange} placeholder="Company Name" />
          </div>
          <div>
            <Label>Location</Label>
            <Input name="location" value={formData.location} onChange={handleChange} placeholder="Job Location" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Job Type</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Category</Label>
              <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Salary</Label>
            <Input name="salary" value={formData.salary} onChange={handleChange} placeholder="$50,000 - $70,000" />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed job description..."
              rows={5}
            />
          </div>

          <Separator />

          <div>
            <Label>Requirements</Label>
            <div className="flex items-center gap-2 mt-2">
              <Input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                placeholder="Enter a requirement"
              />
              <Button type="button" onClick={handleAddRequirement} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {requirements.map((req, index) => (
                <Badge key={index} className="flex items-center">
                  {req}
                  <X className="ml-1 h-3 w-3 cursor-pointer" onClick={() => handleRemoveRequirement(index)} />
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <Label>Posted Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !postedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {postedDate ? format(postedDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={postedDate}
                  onSelect={setPostedDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

        </div>

        <Button type="submit" className="w-full">
          Create Job
        </Button>
      </form>
    </div>
  );
}
