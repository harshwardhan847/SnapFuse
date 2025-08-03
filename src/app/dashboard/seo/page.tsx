import React from "react";
import { SeoForm } from "./_components/seo-form";
import SeoContent from "./_components/seo-content";

const SeoPage = () => {
  return (
    <div className="flex items-start justify-center flex-1 p-4 flex-col gap-12">
      <div className="px-2 sm:px-0">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Generate Content
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Generate SEO ready title, description and tags to rank higher in
          search.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-4 w-full md:max-w-6xl">
        <SeoForm />
        <SeoContent
          title="harsh"
          seoScoreBefore={80}
          seoScoreNow={100}
          tags={["Hat", "Genz", "blue", "fashion"]}
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut animi ut ea id delectus vitae molestias consequatur doloremque quaerat debitis tempora dicta, eos dignissimos cupiditate consequuntur voluptates aperiam architecto sapiente saepe dolorum cumque. Voluptatum laudantium error voluptas, qui animi eum explicabo asperiores ullam accusantium voluptatem, ex consectetur quam nisi alias quis molestias dignissimos, placeat veniam praesentium officia consequuntur aut laboriosam pariatur atque? Molestias recusandae facere aperiam harum sunt nostrum modi, ipsam nihil tempore rem. Eum quaerat beatae commodi autem ex omnis nesciunt laboriosam delectus culpa possimus! Repellendus necessitatibus est corrupti maiores sunt minus magnam vero maxime sint, voluptatum suscipit doloremque? Praesentium aspernatur quos harum vitae est sit distinctio odio accusantium atque in, aut numquam. Ea quam velit natus mollitia animi?
"
        />
      </div>
    </div>
  );
};

export default SeoPage;
