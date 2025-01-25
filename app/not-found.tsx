import NotFound from 'next-rapid/components/NotFound';
import fs from 'fs';
import path from 'path';

const NotFoundPage = async () => {
    // read template html from _rapid/prototype/template.html if found, otherwise use template.default.html
  let template;
  if (!fs.existsSync(path.join(process.cwd(), '/_rapid/prototype/template.html'))) {
    template = fs.readFileSync(path.join(process.cwd(), '_rapid/prototype/template.default.html'), 'utf8');
  } else {
    template = fs.readFileSync(path.join(process.cwd(), '/_rapid/prototype/template.html'), 'utf8');
  }
    return <NotFound template={template} />;
};

export default NotFoundPage;