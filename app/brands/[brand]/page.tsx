import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Clock, Shield, Wrench, Users } from 'lucide-react';
import Hero from '@/components/Hero';
import ApplianceCards from '@/components/ApplianceCards';
import Reviews from '@/components/Reviews';
import SEOContent from '@/components/SEOContent';
import { brands } from '@/lib/data/brands';
import { appliances } from '@/lib/data/appliances';
import { getAppliancesForBrand } from '@/lib/data/serviceBrands';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { generateLocalBusinessSchema, generateServiceSchema, generateBreadcrumbSchema } from '@/lib/seo/schema';

interface PageProps {
  params: Promise<{
    brand: string;
  }>;
}

export async function generateStaticParams() {
  // Only generate top 20 featured brands statically
  return brands.filter(b => b.logo).slice(0, 20).map((brand) => ({
    brand: `${brand.slug}-repair`,
  }));
}

// Enable dynamic rendering for other brands
export const dynamicParams = true;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { brand: brandSlug } = await params;
  // Remove -repair suffix to find brand
  const cleanSlug = brandSlug.replace('-repair', '');
  const brand = brands.find(b => b.slug === cleanSlug);
  if (!brand) return {};
  
  return generatePageMetadata({ brand: cleanSlug });
}

export default async function BrandRepairPage({ params }: PageProps) {
  const { brand: brandSlug } = await params;
  // Remove -repair suffix to find brand
  const cleanSlug = brandSlug.replace('-repair', '');
  const brand = brands.find(b => b.slug === cleanSlug);
  
  if (!brand) {
    notFound();
  }
  
  // Get appliances that this brand manufactures
  const relevantApplianceSlugs = getAppliancesForBrand(cleanSlug);
  const relevantAppliances = appliances.filter(a => relevantApplianceSlugs.includes(a.slug));
  
  const localBusinessSchema = generateLocalBusinessSchema({ brand: cleanSlug });
  const serviceSchema = generateServiceSchema({ brand: cleanSlug });
  const breadcrumbSchema = generateBreadcrumbSchema({ brand: cleanSlug });
  
  return (
    <>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <Hero 
        title={`Expert ${brand.name} Appliance Repair in Fort Worth Metro area`}
        subtitle="Experienced technicians • Same-day service • Upfront pricing"
        brand={brand.name}
        brandLogo={brand.logo}
      />
      
      {/* Appliances Section - Filtered (hidden for brands with no matching service pages, e.g. HVAC) */}
      {/* Appliances Section - Filtered (renders nothing for brands with no matching service pages, e.g. HVAC) */}
      <ApplianceCards
        heading={`${brand.name} Appliances We Service`}
        items={relevantAppliances.map((appliance) => ({
          key: appliance.slug,
          href: `/brands/${brandSlug}/services/${appliance.slug}-repair`,
          title: appliance.name,
          note: `${brand.name} ${appliance.name} Repair`,
          image: appliance.image,
        }))}
      />

      {/* Why Choose Us Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us for {brand.name} Repairs?
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Wrench className="w-10 h-10 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">{brand.name} Specialists</h3>
              <p className="text-gray-600">We service all {brand.name} appliances</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Same-Day Service</h3>
              <p className="text-gray-600">Fast appointments throughout Fort Worth Metro</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Shield className="w-10 h-10 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">The Right Parts</h3>
              <p className="text-gray-600">Parts matched to your {brand.name} model</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                  <Users className="w-10 h-10 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Fully Insured</h3>
              <p className="text-gray-600">Insured for your peace of mind</p>
            </div>
          </div>
        </div>
      </section>
      
      <Reviews />

      {/* Long-form SEO text sits below reviews so the selling blocks come first */}
      <SEOContent brand={cleanSlug} />
    </>
  );
}

