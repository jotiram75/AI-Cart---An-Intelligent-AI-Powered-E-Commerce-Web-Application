import React from 'react'

const Careers = () => {
    const jobs = [
        { title: "Senior React Developer", department: "Engineering", location: "Remote", type: "Full-time" },
        { title: "UI/UX Designer", department: "Design", location: "New York, NY", type: "Full-time" },
        { title: "Fashion Marketing Manager", department: "Marketing", location: "London, UK", type: "Contract" },
        { title: "Customer Success Specialist", department: "Support", location: "Remote", type: "Part-time" },
    ];

  return (
    <div className='container mx-auto px-4 pt-24 pb-16'>
        <div className="text-center mb-12">
            <h1 className='text-3xl font-bold mb-4'>Join the AICart Team</h1>
            <p className='text-gray-600 max-w-2xl mx-auto'>
                We are revolutionizing the fashion industry with AI. We are looking for passionate individuals to join our mission.
            </p>
        </div>

        <div className="grid gap-6 max-w-4xl mx-auto">
            {jobs.map((job, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex justify-between items-center flex-wrap gap-4">
                    <div>
                        <h3 className="font-semibold text-xl text-gray-900">{job.title}</h3>
                        <div className="flex gap-4 text-sm text-gray-500 mt-2">
                            <span>{job.department}</span>
                            <span>•</span>
                            <span>{job.location}</span>
                            <span>•</span>
                            <span>{job.type}</span>
                        </div>
                    </div>
                    <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-opacity-90 transition-colors text-sm font-medium">
                        Apply Now
                    </button>
                </div>
            ))}
        </div>
        
        <div className="mt-16 text-center bg-gray-50 p-12 rounded-2xl">
            <h2 className="text-2xl font-bold mb-4">Don't see a perfect fit?</h2>
            <p className="text-gray-600 mb-6">We are always looking for great talent. Send us your resume.</p>
            <a href="mailto:careers@aicart.com" className="text-primary font-semibold hover:underline">careers@aicart.com</a>
        </div>
    </div>
  )
}

export default Careers
