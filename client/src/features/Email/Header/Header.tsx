import { MdEmail } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

export function Header() {
  return (
    <section className="h-20 w-full bg-sky-600 p-2">
      <div className="mt-2 flex items-center">
        <div className="flex w-1/6 gap-8 text-4xl">
          <p className="flex items-center">
            <MdEmail />
            <span className="hidden sm:hidden md:hidden lg:block">Mailhub</span>
          </p>
        </div>

        <div className="flex w-5/6 justify-between">
          <input
            type="text"
            placeholder="Find messages"
            className="input input-bordered w-full max-w-xs"
          />

          <div className="flex items-center gap-4 text-4xl">
            <IoIosSettings />
            <div className="avatar placeholder online">
              <div className="w-12 rounded-full bg-neutral text-neutral-content">
                <span className="text-xl">AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
