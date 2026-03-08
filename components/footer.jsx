export default function Footer() {
    return (
              <section className="py-24 px-4 bg-green-500">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-black p-2 w-fit mb-4">
                <h2 className="text-2xl font-bold text-white">GET IN TOUCH</h2>
              </div>
              <p className="text-xl mb-8 max-w-xl">
                Interested in our research or potential collaborations? We'd love to hear from you.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 border-2 border-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-icon lucide-map"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Address</h3>
                    <p>
                      American University in Cairo
                      <br />
                      Cairo 11835, Egypt
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white p-2 border-2 border-black">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  </div>
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <p>dina-mahmoud(at)aucegypt.edu</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
}