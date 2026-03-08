"use client";

import Image from "next/image"
import Head from "next/head";

import Navbar from "@/components/navbar"
import Footer from "@/components/footer";

export default function Members() {
    return (
        <>
        <Head>
            <title>ASIC Design School Members</title>
        </Head>
        <Navbar />

        {/* Team Section */}
              <section className="py-24 px-4">
                <div className="container mx-auto mt-24">
                  <div className="text-center mb-16">
                    <div className="bg-blue-500 p-2 w-fit mx-auto mb-4">
                      <h2 className="text-2xl font-bold">Current Members</h2>
                    </div>
                  </div>
        
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      {
                        name: "Dr. Dina G. Mahmoud",
                        role: "Lab Director",
                        image: "/dina-mahmoud.jpg?height=400&width=400",
                      }
                    ].map((member, index) => (
                      <div key={index} className="group">
                        <div className="relative mb-4">
                          <div className="absolute -top-3 -left-3 w-full h-full rounded-xl"></div>
                          <div className="relative z-10 border-4 border-black rounded-xl overflow-hidden">
                            <Image
                              src={member.image || "/placeholder.svg"}
                              alt={member.name}
                              width={400}
                              height={400}
                              className="w-full h-auto object-cover aspect-square"
                            />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold">{member.name}</h3>
                        <p>{member.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <Footer />
        </>
    );
}