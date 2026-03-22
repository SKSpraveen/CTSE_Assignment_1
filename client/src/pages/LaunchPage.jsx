
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { User, Stethoscope, ShieldCheck } from "lucide-react";

export default function LaunchPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#0a1833] to-[#162447] flex flex-col items-center px-4 py-10">
      <h1 className="text-4xl md:text-5xl font-extrabold text-blue-100 mb-6 tracking-tight text-center drop-shadow-lg">
        Welcome to <span className="text-blue-400">AppointEase</span>
      </h1>
      <p className="text-lg text-blue-200 mb-12 text-center max-w-2xl">A modern platform for seamless appointment management. Choose your section below to get started.</p>
      <div className="flex flex-col gap-16 w-full max-w-7xl">
        {/* User Section */}
        <div className="mt-8">
          <h3 className="text-3xl font-bold text-blue-300 text-center">For Patients & Users</h3>
        </div>
        <section id="user-section" className="rounded-3xl bg-blue-900/20 backdrop-blur-md shadow-2xl px-8 md:px-24 py-16 flex flex-col md:flex-row items-center border-2 border-blue-700/60 hover:shadow-2xl transition-all min-h-[340px] w-full max-w-[95vw]">
          <div className="shrink-0 flex flex-col items-center md:items-start md:w-64 mb-6 md:mb-0">
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-800 text-blue-300 mb-4 shadow-lg">
              <User size={48} />
            </span>
            <h2 className="text-4xl font-extrabold text-blue-100 tracking-tight mb-2">Patients</h2>
          </div>
          <div className="flex-1 md:ml-16">
            <p className="text-blue-200 mb-4 text-lg">Book appointments, manage your health profile, and track your appointment history with ease.</p>
            <ul className="text-blue-300 text-base mb-4 list-disc pl-6">
              <li>Book and manage appointments</li>
              <li>View appointment history</li>
              <li>Update your personal profile</li>
              <li>Receive appointment reminders</li>
              <li>Access doctor profiles and ratings</li>
              <li>Download visit summaries as PDF</li>
              <li>24/7 support for users</li>
            </ul>
            <div className="mb-6 text-blue-400 text-sm">
              <span className="block mb-1 font-semibold text-blue-200">Your health, your control.</span>
              <span className="block">All your health data is encrypted and private. Enjoy a seamless experience with instant appointment booking, reminders, and access to top-rated doctors.</span>
            </div>
            <Link to="/login">
              <Button className="w-full md:w-auto">User Login</Button>
            </Link>
          </div>
        </section>
        {/* Doctor Section */}
        <div className="mt-8">
          <h3 className="text-3xl font-bold text-blue-300 text-center">For Doctors</h3>
        </div>
        <section id="doctor-section" className="rounded-3xl bg-blue-900/20 backdrop-blur-md shadow-2xl px-8 md:px-24 py-16 flex flex-col md:flex-row items-center border-2 border-blue-700/60 hover:shadow-2xl transition-all min-h-[340px] w-full max-w-[95vw]">
          <div className="shrink-0 flex flex-col items-center md:items-start md:w-64 mb-6 md:mb-0">
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-800 text-blue-300 mb-4 shadow-lg">
              <Stethoscope size={48} />
            </span>
            <h2 className="text-4xl font-extrabold text-blue-100 tracking-tight mb-2">Doctors</h2>
          </div>
          <div className="flex-1 md:ml-16">
            <p className="text-blue-200 mb-4 text-lg">Manage your appointments, view patient details, and receive notifications for new bookings.</p>
            <ul className="text-blue-300 text-base mb-4 list-disc pl-6">
              <li>View and manage your schedule</li>
              <li>Access patient information and history</li>
              <li>Receive instant notifications for new bookings</li>
              <li>Write and share digital prescriptions</li>
              <li>Manage availability and time slots</li>
              <li>Export appointment data to Excel</li>
              <li>Secure doctor-patient messaging</li>
            </ul>
            <div className="mb-6 text-blue-400 text-sm">
              <span className="block mb-1 font-semibold text-blue-200">Empowering your practice.</span>
              <span className="block">Easily manage your schedule, connect securely with patients, and streamline your workflow with digital tools and real-time notifications.</span>
            </div>
            <Link to="/provider/login">
              <Button className="w-full md:w-auto">Doctor Login</Button>
            </Link>
          </div>
        </section>
        {/* Admin Section */}
        <div className="mt-8">
          <h3 className="text-3xl font-bold text-blue-300 text-center">For Admins</h3>
        </div>
        <section id="admin-section" className="rounded-3xl bg-blue-900/20 backdrop-blur-md shadow-2xl px-8 md:px-24 py-16 flex flex-col md:flex-row items-center border-2 border-blue-700/60 hover:shadow-2xl transition-all min-h-[340px] w-full max-w-[95vw]">
          <div className="shrink-0 flex flex-col items-center md:items-start md:w-64 mb-6 md:mb-0">
            <span className="inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-blue-800 text-blue-300 mb-4 shadow-lg">
              <ShieldCheck size={48} />
            </span>
            <h2 className="text-4xl font-extrabold text-blue-100 tracking-tight mb-2">Administrator</h2>
          </div>
          <div className="flex-1 md:ml-16">
            <p className="text-blue-200 mb-4 text-lg">Oversee the platform, manage users and doctors, and access analytics and reports.</p>
            <ul className="text-blue-300 text-base mb-4 list-disc pl-6">
              <li>Manage users and doctors</li>
              <li>Monitor appointments and platform activity</li>
              <li>Access analytics, charts, and reports</li>
              <li>Approve or suspend accounts</li>
              <li>Send platform-wide announcements</li>
              <li>Export data for compliance</li>
              <li>Role-based access control</li>
            </ul>
            <div className="mb-6 text-blue-400 text-sm">
              <span className="block mb-1 font-semibold text-blue-200">Full control & insights.</span>
              <span className="block">Monitor platform activity, manage users and providers, and access powerful analytics to keep your system running smoothly and securely.</span>
            </div>
            <Link to="/admin/login">
              <Button className="w-full md:w-auto">Admin Login</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
