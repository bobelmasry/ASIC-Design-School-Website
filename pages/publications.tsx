"use client";

import Head from "next/head";
import Navbar from "@/components/navbar"
import Footer from "@/components/footer";

  export default function Publications() { 
    return (
        <>
        <Head>
            <title>ASIC Design School Publications</title>
        </Head>
        <Navbar />

            {/* Latest Publications */}
      <section className="py-24 px-4 bg-blue-500">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <div className="bg-black p-4 w-fit mb-4 mt-20">
                <h2 className="text-2xl font-bold text-white">PUBLICATIONS</h2>
              </div>
            </div>
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
            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h3 className="text-xl font-bold">
                    <a href="https://ieeexplore.ieee.org/document/9256623" className="hover:underline hover:text-blue-600" target="_blank">
                    Building OpenLANE: A 130nm OpenROAD-based Tapeout-Proven Flow
                    </a>
                </h3>
                <p className="text-sm mt-2">
                    <a href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Shalan</a>,{" "}
                    <a href="https://github.com/RTimothyEdwards" className="hover:underline hover:text-blue-600" target="_blank">Tim Edwards</a>
                </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">ICCAD</span>
                <span className="text-sm mt-1">2020</span>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h3 className="text-xl font-bold">
                    <a href="https://woset-workshop.github.io/PDFs/2020/a21.pdf" className="hover:underline hover:text-blue-600" target="_blank">
                    OpenLANE: The Open-Source Digital ASIC Implementation Flow
                    </a>
                </h3>
                <p className="text-sm mt-2">
                    <a href="#" className="hover:underline hover:text-blue-600" target="_blank">Ahmed Ghazy</a>,{" "}
                    <a href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Shalan</a>
                </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">WOSET</span>
                <span className="text-sm mt-1">2020</span>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h3 className="text-xl font-bold">
                    <a href="#" className="hover:underline hover:text-blue-600" target="_blank">
                    A Push-button Idea to GDS-II SoC Design Flow
                    </a>
                </h3>
                <p className="text-sm mt-2">
                    <a href="#" className="hover:underline hover:text-blue-600" target="_blank">Habiba Gamal</a>,{" "}
                    <a href="#" className="hover:underline hover:text-blue-600" target="_blank">Amr Gouhar</a>,{" "}
                    <a href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Shalan</a>
                </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">WOSET</span>
                <span className="text-sm mt-1">2020</span>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h3 className="text-xl font-bold">
                    <a href="#" className="hover:underline hover:text-blue-600" target="_blank">
                    Fault, an Open Source DFT Toolchain
                    </a>
                </h3>
                <p className="text-sm mt-2">
                    <a href="https://github.com/donn" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Gaber</a>,{" "}
                    <a href="https://github.com/Manarabdelaty" className="hover:underline hover:text-blue-600" target="_blank">Manar Abdelatty</a>,{" "}
                    <a href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Shalan</a>
                </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">WOSET</span>
                <span className="text-sm mt-1">2019</span>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h3 className="text-xl font-bold">
                    <a href="https://woset-workshop.github.io/PDFs/2019/a18.pdf" className="hover:underline hover:text-blue-600" target="_blank">
                    OGRE: Open-Source Global Router
                    </a>
                </h3>
                <p className="text-sm mt-2">
                    <a href="#" className="hover:underline hover:text-blue-600" target="_blank">Habiba Hassanien</a>,{" "}
                    <a href="#" className="hover:underline hover:text-blue-600" target="_blank">Fady Abo El Magd</a>,{" "}
                    <a href="#" className="hover:underline hover:text-blue-600" target="_blank">Ali El-Said</a>,{" "}
                    <a href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Shalan</a>
                </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">WOSET</span>
                <span className="text-sm mt-1">2019</span>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h3 className="text-xl font-bold">
                    <a href="https://woset-workshop.github.io/PDFs/2018/a12.pdf" className="hover:underline hover:text-blue-600" target="_blank">
                    Open-source SoC Workflow in Cloud V
                    </a>
                </h3>
                <p className="text-sm mt-2">
                    <a href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Shalan</a>,{" "}
                    <a href="https://vivo.brown.edu/display/sreda" className="hover:underline hover:text-blue-600" target="_blank">Sherief Reda</a>
                </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">WOSET</span>
                <span className="text-sm mt-1">2018</span>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h3 className="text-xl font-bold">
                    <a href="https://www.researchgate.net/publication/321379626_Cloud-based_RISC-V_SoC_Design_and_Co-simulation" className="hover:underline hover:text-blue-600" target="_blank">
                    Cloud-Based RISC-V SoC design and Co-simulation
                    </a>
                </h3>
                <p className="text-sm mt-2">
                    <a href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Shalan</a>,{" "}
                    <a href="https://vivo.brown.edu/display/sreda" className="hover:underline hover:text-blue-600" target="_blank">Sherief Reda</a>
                </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">RISC-V Workshop</span>
                <span className="text-sm mt-1">2017</span>
                </div>
            </div>
            </div>

            <div className="bg-white p-6 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 transition-transform">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                <h3 className="text-xl font-bold">
                    <a href="https://ieeexplore.ieee.org/document/7945081/" className="hover:underline hover:text-blue-600" target="_blank">
                    CloudV: A Cloud-Based Educational Digital Design Environment
                    </a>
                </h3>
                <p className="text-sm mt-2">
                    <a href="https://scholar.google.com.eg/citations?view_op=list_works&hl=en&hl=en&user=E4nxRX0AAAAJ" className="hover:underline hover:text-blue-600" target="_blank">Mohamed Shalan</a>,{" "}
                    <a href="https://vivo.brown.edu/display/sreda" className="hover:underline hover:text-blue-600" target="_blank">Sherief Reda</a>
                </p>
                </div>
                <div className="flex flex-col items-start md:items-end">
                <span className="bg-yellow-300 px-2 py-1 font-bold text-sm">IEEE MSE</span>
                <span className="text-sm mt-1">May 2017</span>
                </div>
            </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
        </>
    )
  }  