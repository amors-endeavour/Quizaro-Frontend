type Props = {
  title: string;
  desc: string;
};

export default function FeatureCard({ title, desc }: Props) {
  return (
    <div className="bg-[#111111] border border-[#333333] p-8 rounded-lg hover:border-[#666666] transition-colors">
      <h3 className="text-2xl font-semibold mb-4 text-foreground">{title}</h3>
      <p className="text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}