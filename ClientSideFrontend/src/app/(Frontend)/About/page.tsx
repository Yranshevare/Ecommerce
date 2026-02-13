import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Leaf, Heart, Award, Users, MapPin, Mail, Phone } from "lucide-react";

const values = [
    {
        icon: Leaf,
        title: "Sustainable Sourcing",
        description:
            "We partner with eco-conscious mills to bring you 100% organic cotton and natural linen, minimizing our environmental footprint.",
    },
    {
        icon: Heart,
        title: "Crafted with Care",
        description: "Every product is carefully inspected for quality — from thread count to stitching — so you get nothing but the best.",
    },
    {
        icon: Award,
        title: "Premium Quality",
        description: "Our fabrics are selected for durability and softness, designed to feel luxurious wash after wash.",
    },
    {
        icon: Users,
        title: "Customer First",
        description: "With thousands of happy homes, we prioritize your comfort and satisfaction above everything else.",
    },
];

const stats = [
    { value: "50K+", label: "Happy Customers" },
    { value: "200+", label: "Products" },
    { value: "15+", label: "Countries Shipped" },
    { value: "4.8★", label: "Average Rating" },
];

const About = () => {
    return (
        <div className="min-h-screen bg-stone-50">
            <Header />
            <main>
                {/* Hero Section */}
                <section className="bg-stone-800 text-stone-50 py-20 md:py-28 px-10">
                    <div className="container text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">About Ojha Signatures</h1>
                        <p className="text-stone-50/70 text-lg leading-relaxed">
                            We believe your home deserves the finest. Ojha Signatures was born from a simple idea — premium home textiles shouldn't come with
                            a premium price tag.
                        </p>
                    </div>
                </section>

                {/* Our Story */}
                <section className="py-20 px-10">
                    <div className="container max-w-4xl mx-auto">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4">Our Story</h2>
                            <div className="w-16 h-1 bg-emerald-700 mx-auto rounded-full" />
                        </div>
                        <div className="space-y-6 text-stone-600 leading-relaxed text-center max-w-2xl mx-auto">
                            <p>
                                Founded in 2020, Ojha Signatures started as a small passion project driven by the desire to make everyday home essentials feel
                                extraordinary. We noticed that finding high-quality bedsheets, pillow covers, and sofa covers at reasonable prices was
                                harder than it should be.
                            </p>
                            <p>
                                So we set out to change that. By working directly with artisan weavers and trusted fabric mills, we cut out the
                                middlemen and pass the savings on to you — without ever compromising on quality.
                            </p>
                            <p>
                                Today, Ojha Signatures serves thousands of homes across the globe, offering a curated collection of home textiles that blend
                                comfort, style, and sustainability.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="bg-emerald-700 py-16 px-10">
                    <div className="container">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-3xl md:text-4xl font-serif font-bold text-stone-50 mb-2">{stat.value}</div>
                                    <div className="text-emerald-100 text-sm">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* What We Sell */}
                <section className="py-20 px-10">
                    <div className="container">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4">What We Offer</h2>
                            <p className="text-stone-500 max-w-md mx-auto">Premium home textiles designed for comfort and everyday luxury</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            {[
                                {
                                    title: "Bedsheets",
                                    description:
                                        "From crisp cotton to silky sateen, our bedsheets transform your bedroom into a sanctuary of comfort. Available in single, double, queen, and king sizes.",
                                },
                                {
                                    title: "Pillow Covers",
                                    description:
                                        "Decorative and functional — our pillow covers come in a variety of textures, patterns, and fabrics to complement any room aesthetic.",
                                },
                                {
                                    title: "Sofa Covers",
                                    description:
                                        "Protect and refresh your furniture with our stretchable, machine-washable sofa covers. Easy to fit, easy to maintain, easy to love.",
                                },
                            ].map((product) => (
                                <div
                                    key={product.title}
                                    className="bg-white rounded-2xl p-8 border border-stone-200 text-center hover:shadow-lg transition-shadow duration-300"
                                >
                                    <h3 className="text-xl font-serif font-semibold text-stone-800 mb-3">{product.title}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">{product.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Our Values */}
                <section className="py-20 bg-stone-100 px-10">
                    <div className="container">
                        <div className="text-center mb-14">
                            <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4">Our Values</h2>
                            <p className="text-stone-500 max-w-md mx-auto">The principles that guide everything we do</p>
                        </div>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((value) => (
                                <div key={value.title} className="text-center group">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mb-5 transition-all duration-300 group-hover:bg-emerald-700 group-hover:text-stone-50">
                                        <value.icon className="w-7 h-7" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-stone-800 mb-2">{value.title}</h3>
                                    <p className="text-stone-500 text-sm leading-relaxed">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section id="contact" className="py-20 px-10">
                    <div className="container max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4">Get in Touch</h2>
                        <p className="text-stone-500 mb-10">Have questions? We'd love to hear from you.</p>
                        <div className="grid sm:grid-cols-3 gap-6">
                            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-stone-200">
                                <MapPin className="w-6 h-6 text-emerald-700" />
                                <span className="text-sm text-stone-600">Sadguru Nagar, Diva East</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-stone-200">
                                <Mail className="w-6 h-6 text-emerald-700" />
                                <span className="text-sm text-stone-600">ojha.signatures@gmail.com</span>
                            </div>
                            <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-stone-200">
                                <Phone className="w-6 h-6 text-emerald-700" />
                                <span className="text-sm text-stone-600">+91 9082811050</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default About;
