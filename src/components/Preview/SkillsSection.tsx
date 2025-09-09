import type { FC } from "react";
import type { Skill } from "../../types/cv.types";

export const SkillsSection: FC<{ skills: Skill[] }> = ({ skills }) => {
  return (
    <section className="mt-12">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-1 h-10 bg-gradient-to-b from-green-500 to-blue-600 rounded-full"></div>
        <h2 className="text-3xl font-light text-gray-800 tracking-wide">
          Habilidades
        </h2>
      </div>
      
      {!skills?.length ? (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-8">
          <p className="text-gray-600 text-center">Nenhuma habilidade informada.</p>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl shadow-md p-8">
          <div className="space-y-4">
            {skills.map((s) => (
              <div
                key={s.id}
                className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center hover:shadow-md transition-shadow"
              >
                <span className="font-medium text-gray-800 text-lg">
                  {s.name} ({s.level})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
