const fs = require('fs');
const path = require('path');

function patchFile(filepath, items3DStr, componentStr) {
    let content = fs.readFileSync(filepath, 'utf8');

    // 1. imports
    if (!content.includes('import { Interactive3DViewer }')) {
        content = content.replace('import { CanvaShowcase } from \\'@/components/themes/widgets/CanvaShowcase\\';', 'import { CanvaShowcase } from \\'@/components/themes/widgets/CanvaShowcase\\';\\nimport { Interactive3DViewer } from \\'@/components/ui/Interactive3DViewer\\';');
    }

    // 2. items3D
    if (!content.includes('const items3D = allProjects.filter')) {
        content = content.replace('const archiveItems = (data?.projects || data?.user?.projects || []).slice(0, 4);', 'const allProjects = data?.projects || data?.user?.projects || [];\\n    const items3D = allProjects.filter((p: any) => p.projectType === \\'3d\\');\\n    const archiveItems = allProjects.filter((p: any) => p.projectType !== \\'3d\\').slice(0, 4);');
    }

    // 3. Component
    if (!content.includes('3D SHOWCASE SECTION')) {
        content = content.replace('            </section>\\r\\n\\r\\n            {/* INTEGRATIONS */}', componentStr);
        if (!content.includes('3D SHOWCASE SECTION')) {
           content = content.replace('            </section>\\n\\n            {/* INTEGRATIONS */}', componentStr);
        }
    }
    
    fs.writeFileSync(filepath, content, 'utf8');
}

const auraComp = `            </section>

            {/* ================= 3D SHOWCASE SECTION ================= */}
            {items3D.length > 0 && (
                <section className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-24 @md:py-32 border-t border-white/5">
                    <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="text-center mb-16">
                        <h2 className="font-serif text-4xl @md:text-5xl font-bold">Interactive Models</h2>
                        <p className="font-sans text-white/50 mt-4 text-sm">Explore spatial design in 3D.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 @md:grid-cols-2 gap-6 @md:gap-10">
                        {items3D.map((p: any, i: number) => (
                            <motion.div
                                key={i}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className={\`group relative block w-full @md:col-span-1\`}
                            >
                                <div className={\`relative w-full aspect-square @md:aspect-[4/3] \${radiusClass} overflow-hidden bg-white/5 border border-white/10 backdrop-blur-xl p-2 transition-all duration-500 hover:border-[var(--hl)] hover:bg-white/10\`}>
                                    <div className={\`relative w-full h-full \${radiusClass} overflow-hidden bg-[#0a0a0c]\`}>
                                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0c" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none opacity-80 group-hover:opacity-40 transition-opacity duration-500"></div>

                                        <div className="absolute bottom-0 left-0 w-full p-6 @md:p-8 flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-none">
                                            <div className="flex flex-col">
                                                <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-[var(--hl)] mb-2 drop-shadow-md">3D Asset</span>
                                                <h3 className="font-serif text-2xl @md:text-3xl font-bold text-white drop-shadow-lg">{p.title}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* INTEGRATIONS */}`;

patchFile(path.join('c:/Users/user/portfobe-app/components/themes/AuraKineticTheme.tsx'), '', auraComp);
console.log("Done");
