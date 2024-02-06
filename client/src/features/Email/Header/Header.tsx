import { MdEmail } from "react-icons/md";
import { IoIosSettings } from "react-icons/io";

export function Header() {
  return (
    <section className="bg-sky-600 p-2 w-full h-20">
      <div className="flex items-center mt-2">
        <div className="flex text-4xl gap-8 w-1/6">
          <p className="flex items-center">
            <MdEmail />
            <span className="lg:block md:hidden sm:hidden hidden">Mailhub</span>
          </p>
        </div>

        <div className="flex justify-between w-5/6">
          <input
            type="text"
            placeholder="Find messages"
            className="input input-bordered w-full max-w-xs"
          />

          <div className="flex items-center text-4xl gap-4">
            <IoIosSettings />
            <div className="avatar online placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-12">
                <span className="text-xl">AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
