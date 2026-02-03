import React from "react";

export default function RenderDetails({ details }: { details: string }) {
    return (
        <>
            <style>{`
            /* ===== Desktop (your existing styles) ===== */
ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}

ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}

li {
  margin: 0.25rem 0;
}

h1 {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 1rem 0 0.75rem;
}

h2 {
  font-size: 1.75rem;
  font-weight: 600;
  line-height: 1.3;
  margin: 0.75rem 0 0.5rem;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.4;
  margin: 0.75rem 0 0.5rem;
}

h4 {
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
  margin: 0.5rem 0 0.25rem;
}

h5 {
  font-size: 1.125rem;
  font-weight: 500;
  line-height: 1.5;
  margin: 0.5rem 0 0.25rem;
}

/* ===== Mobile styles ===== */
@media (max-width: 768px) {
  ul,
  ol {
    padding-left: 1.25rem;
  }

  li {
    margin: 0.2rem 0;
  }

  h1 {
    font-size: 1.75rem;
    margin: 0.75rem 0 0.5rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  h3 {
    font-size: 1.25rem;
  }

  h4 {
    font-size: 1.125rem;
  }

  h5 {
    font-size: 1rem;
  }
}



            `}</style>

            <div className="text-justify" dangerouslySetInnerHTML={{ __html: details }}></div>
        </>
    );
}
