import { render } from 'gfm/mod.ts';
import { extract, test } from 'std/encoding/front_matter.ts';
import { expandGlobSync } from 'std/fs/mod.ts';
import 'prism/components/prism-jsx.js?no-check';
import 'prism/components/prism-ruby.js?no-check';
import 'prism/components/prism-tsx.js?no-check';
import 'prism/components/prism-typescript.js?no-check';

export type PostFrontMatter = {
  title: string;
  tags?: Array<string>;
  description?: string;
};

export type PostMetaData = PostFrontMatter & {
  date: string;
  slug: string;
};

export type Post = PostMetaData & {
  body: string;
};

type Slug = {
  text: string;
  date: string;
  name?: string;
};

const parseSlug = (slug: string): Slug | undefined => {
  const matches = slug.match(
    /^(?<date>[0-9]{4}-[0-9]{2}-[0-9]{2})(-(?<name>.+))?/
  );

  const date = matches?.groups?.['date'];
  const name = matches?.groups?.['name'];

  if (date == null) {
    return undefined;
  }

  return {
    text: slug,
    date,
    name,
  };
};

export const readPost = async (slug: string): Promise<Post | undefined> => {
  const parsedSlug = parseSlug(slug);

  if (!parsedSlug) {
    return undefined;
  }

  let text;
  try {
    text = await Deno.readTextFile(`./posts/${slug}.md`);
  } catch (_) {
    return undefined;
  }
  const { attrs, body } = test(text)
    ? extract<PostFrontMatter>(text)
    : { attrs: undefined, body: text };

  return {
    slug,
    date: parsedSlug.date,
    title: attrs?.title ?? slug,
    tags: attrs?.tags ?? [],
    description: attrs?.description,
    body: render(body),
  };
};

export const readPosts = async (): Promise<Array<Post>> => {
  const slugs = [...expandGlobSync('./posts/*.md')].map((file) =>
    file.name.replace(/\.md$/, '')
  );

  return await (
    await Promise.all(slugs.map((slug) => readPost(slug)))
  ).filter((post): post is Post => post != null);
};
