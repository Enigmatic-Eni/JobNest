import Navbar from '@/components/Navbar'
import React from 'react'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Footer from '@/components/Footer';

function Profile() {
 
  return (
    <div className=' relative px-8'>
        <div className=' shadow-md px-8 fixed top-0 left-0 right-0 z-50 bg-white'>
            <Navbar/>
        </div>

        <div className='h-[120px]'></div>

        <h2 className="max-w-3xl mx-auto text-2xl font-semibold bg-theme text-white text-center py-5 rounded-t-xl">Create Your Profile</h2>
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-b-xl">

      <form className="space-y-6">
        {/* Profile Photo */}
        <div>
          <Label htmlFor="photo">Profile Photo (optional)</Label>
          <Input type="file" id="photo" />
        </div>

        {/* Full Name */}
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input type="text" id="name" placeholder="John Doe" />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="email" id="email" placeholder="john@example.com" />
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input type="tel" id="phone" placeholder="+1234567890" />
        </div>

        {/* Location */}
        <div>
          <Label htmlFor="location">Location</Label>
          <Input type="text" id="location" placeholder="Lagos, Nigeria" />
        </div>

        {/* Professional Title */}
        <div>
          <Label htmlFor="title">Professional Title</Label>
          <Input type="text" id="title" placeholder="Frontend Developer" />
        </div>

        {/* Skills */}
        <div>
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Input type="text" id="skills" placeholder="HTML, CSS, React" />
        </div>

        {/* Experience Level */}
        <div>
          <Label htmlFor="level">Experience Level</Label>
          <select
            id="level"
            className="w-full border rounded px-3 py-2 mt-1 text-sm"
          >
            <option value="">Select</option>
            <option>Entry Level</option>
            <option>Mid Level</option>
            <option>Senior Level</option>
          </select>
        </div>

        {/* Years of Experience */}
        <div>
          <Label htmlFor="years">Years of Experience</Label>
          <Input type="number" id="years" placeholder="2" />
        </div>

        {/* Bio / Summary */}
        <div>
          <Label htmlFor="bio">Bio / Summary</Label>
          <textarea
            id="bio"
            className="w-full border rounded px-3 py-2 mt-1 text-sm"
            rows="4"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        {/* Portfolio Link */}
        <div>
          <Label htmlFor="portfolio">Portfolio Link (optional)</Label>
          <Input
            type="url"
            id="portfolio"
            placeholder="https://yourportfolio.com"
          />
        </div>

        {/* CV Upload */}
        <div>
          <Label htmlFor="cv">Upload CV</Label>
          <Input type="file" id="cv" />
        </div>

        {/* Social Links */}
        <div>
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            type="url"
            id="linkedin"
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
        <div>
          <Label htmlFor="github">GitHub</Label>
          <Input
            type="url"
            id="github"
            placeholder="https://github.com/yourusername"
          />
        </div>

        {/* Submit Button */}
        <div className=' justify-center flex'>
          <Button type="submit" className="">
            Save Profile
          </Button>
        </div>
      </form>
    </div>

     <div className=' pt-4'>
     <Footer/>
     </div>
    </div>
  )
}

export default Profile