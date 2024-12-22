FROM public.ecr.aws/lambda/nodejs:18

# Install pnpm - needed for workspace: dependencies
RUN npm install -g pnpm

# Copy workspace config and all package.json files first
COPY pnpm-workspace.yaml ${LAMBDA_TASK_ROOT}/
COPY pnpm-lock.yaml ${LAMBDA_TASK_ROOT}/
COPY package.json ${LAMBDA_TASK_ROOT}/
COPY shared/package.json ${LAMBDA_TASK_ROOT}/shared/
COPY backend/package.json ${LAMBDA_TASK_ROOT}/backend/

# Install dependencies
RUN pnpm install

# Now copy everything else
COPY shared ${LAMBDA_TASK_ROOT}/shared
COPY backend ${LAMBDA_TASK_ROOT}/backend

# Navigate to backend directory and run its build
WORKDIR ${LAMBDA_TASK_ROOT}/backend
RUN pnpm run build

CMD [ "dist/index.handler" ]
