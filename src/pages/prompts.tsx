import { GetStaticProps, NextPage } from "next";
import DefaultLayout from "../layout/default";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";

interface Prompt {
  id: number;
  category: string;
  level: string;
  template: string;
  example: string;
}

const PromptsPage: NextPage = () => {
  const { t } = useTranslation();
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [category, setCategory] = useState<string>("");
  const [level, setLevel] = useState<string>("");

  useEffect(() => {
    fetch("/prompts.json")
      .then((res) => res.json())
      .then((data) => setPrompts(data as Prompt[]));
  }, []);

  const categories = Array.from(new Set(prompts.map((p) => p.category)));
  const levels = Array.from(new Set(prompts.map((p) => p.level)));

  const filtered = prompts.filter(
    (p) =>
      (category === "" || p.category === category) &&
      (level === "" || p.level === level)
  );

  return (
    <DefaultLayout className="p-4" centered>
      <h1 className="mb-4 text-2xl font-bold">
        {t("prompts-dashboard", "Prompts Dashboard")}
      </h1>
      <div className="mb-4 flex flex-wrap gap-4">
        <select
          className="rounded-md p-2 text-black"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">{t("all-categories", "All Categories")}</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          className="rounded-md p-2 text-black"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">{t("all-levels", "All Levels")}</option>
          {levels.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700 text-sm">
          <thead className="bg-gray-700 text-white">
            <tr>
              <th className="px-2 py-1">ID</th>
              <th className="px-2 py-1">{t("category", "Category")}</th>
              <th className="px-2 py-1">{t("level", "Level")}</th>
              <th className="px-2 py-1">{t("template", "Template")}</th>
              <th className="px-2 py-1">{t("example", "Example")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {filtered.map((p) => (
              <tr key={p.id} className="bg-gray-800 text-white">
                <td className="px-2 py-1">{p.id}</td>
                <td className="px-2 py-1">{p.category}</td>
                <td className="px-2 py-1">{p.level}</td>
                <td className="px-2 py-1">{p.template}</td>
                <td className="px-2 py-1">{p.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DefaultLayout>
  );
};

export default PromptsPage;

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? "en", ["common"])),
  },
});
