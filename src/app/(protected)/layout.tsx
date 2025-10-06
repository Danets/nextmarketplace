import { Navbar } from "./_components/navbar";


export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen w-full bg-sky-500">
            <div className="w-11/12 mx-auto flex-col justify-center items-center gap-2">
                <header>
                    <Navbar />
                </header>
                <main>
                    {children}
                </main>
                <footer></footer>
            </div>
        </div >

    )
}
