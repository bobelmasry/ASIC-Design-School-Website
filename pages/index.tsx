"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import Head from "next/head"

import { NavigationMenuLink } from "@/components/ui/navigation-menu"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from "@/components/ui/card"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <>
    <Head>
      <title>AUC ASIC Design School</title>
      <link rel="icon" href="favicon.ico" />
    </Head>

      <Navbar />

      {/* Latest Publications */}
      <section className="py-24 px-4 bg-blue-500">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="bg-black p-4 w-fit mb-4 mt-4 md:mt-20">
                <h2 className="text-2xl font-bold text-white">LATEST PUBLICATIONS</h2>
              </div>
            </div>
            <Link href={"/publications"}>
            <Button className="text-xl mt-4 cursor-pointer md:mt-0 bg-white text-black border-4 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)]">
               View All Publications <span className="ml-2 h-4 w-4" />
            </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">
                    <a href="https://arxiv.org/abs/2405.17378" className="hover:underline hover:text-blue-600" target="blank">Rtl-repo: A benchmark for evaluating llms on large-scale rtl design projects</a>
                  </h3>
                  <p className="text-sm mt-2">
                    <a target="_blank" href="https://github.com/0xallam" className="hover:underline hover:text-blue-600">Allam, A.</a>,{" "}
                    <a target="_blank" href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600">Shalan, M.</a>
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">
                    2024 IEEE LLM Aided Design Workshop (LAD)
                  </span>
                  <span className="text-sm mt-1">June 2024</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">
                   <a target="blank" href="https://ieeexplore.ieee.org/document/9531753" className="hover:underline hover:text-blue-600"> Digital asic implementation of risc-v: Openlane and commercial approaches in comparison</a>
                  </h3>
                  <p className="text-sm mt-2">
                    <a target="_blank" href="https://github.com/Sarah-Hesham-2022" className="hover:underline hover:text-blue-600">Hesham, S.</a>,{" "}
                    <a target="_blank" href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600">Shalan, M.</a>,{" "}
                    <a target="_blank" href="https://eng.asu.edu.eg/staff/watheq.elkharashi" className="hover:underline hover:text-blue-600">Watheq El-Kharashi, M.</a>,{" "}
                    <a target="_blank" href="https://scholar.google.com/citations?user=pukEdt4AAAAJ&hl=en" className="hover:underline hover:text-blue-600">Dessouky, M.</a>
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">
                    2021 IEEE International Midwest Symposium on Circuits and Systems (MWSCAS)
                  </span>
                  <span className="text-sm mt-1">August 2021</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold"><a href="https://ieeexplore.ieee.org/document/9336682" className="hover:underline hover:text-blue-600" target="blank"> Real silicon using open-source EDA</a></h3>
                  <p className="text-sm mt-2">
                    <a target="_blank" href="https://github.com/RTimothyEdwards" className="hover:underline hover:text-blue-600">Timothy Edwards, R.</a>,{" "}
                    <a target="_blank" href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600">Shalan, M.</a>,{" "}
                    <a target="_blank" href="https://www.linkedin.com/in/mkkassem/" className="hover:underline hover:text-blue-600">Kassem, M.</a>
                  </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                  <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">IEEE Design & Test</span>
                  <span className="text-sm mt-1">January 2021</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Research Areas */}
    <section className="py-24 px-4">
        <div className="container mx-auto mt-20">
          <div className="text-center mb-16">
            <div className="bg-blue-500 p-2 w-fit mx-auto mb-4">
              <h2 className="text-2xl font-bold">RESEARCH AREAS</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "TinyML",
                description: "Optimizing machine learning models for ultra-low-power microcontrollers and edge devices.",
                color: "bg-pink-500",
              },
              {
                title: "EDA",
                description: "Advancing electronic design automation tools for efficient chip design and verification.",
                color: "bg-green-500",
              },
              {
                title: "Digital ASIC",
                description: "Designing custom digital application-specific integrated circuits for high-performance tasks.",
                color: "bg-purple-500",
              },
              {
                title: "Low Power Computing",
                description: "Creating energy-efficient computing architectures for embedded and mobile systems.",
                color: "bg-orange-500",
              }
              
            ].map((area, index) => (
              <Card
                key={index}
                className="group overflow-hidden border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] transition-all hover:-translate-y-2"
              >
                <div className={`h-8 ${area.color}`}></div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-3">{area.title}</h3>
                  <p className="mb-4">{area.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <div className="bg-green-500 p-2 w-fit mx-auto mb-4">
              <h2 className="text-2xl font-bold">OUR TEAM</h2>
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

          <div className="mt-12 text-center">
            <Button className="text-lg px-8 py-6 bg-black text-white border-4 border-black transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)]">
              <Link href="/members"> Meet The Full Team </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}

function ListItem({
  className,
  title,
  children,
  ...props
}: React.ComponentProps<"a">) {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "hover:bg-accent block text-main-foreground select-none space-y-1 rounded-base border-2 border-transparent p-3 leading-none no-underline outline-hidden transition-colors hover:border-border",
            className,
          )}
          {...props}
        >
          <div className="text-base font-heading leading-none">{title}</div>
          <p className="font-base line-clamp-2 text-sm leading-snug">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
}
ListItem.displayName = "ListItem"
ListItem.defaultProps = {
  className: "",
}