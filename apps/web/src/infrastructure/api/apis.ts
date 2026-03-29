import type {
  CallWithoutToken,
  SuccessResponse,
} from '../../domain/api/api-domain';
import type { ApiRepository } from '../../domain/api/api-repository';
import type {
  CreateOrPatchTodo,
  TodoIdParams,
  TodoResponse,
} from '../../domain/api/api-scheme';

export const implApiRepository = ({
  callWithoutToken,
}: {
  callWithoutToken: CallWithoutToken;
}) =>
  ({
    'GET /todos': () => {
      return callWithoutToken<SuccessResponse<TodoResponse[]>>({
        method: 'GET',
        path: 'todos',
      });
    },
    'GET /todos/:id': ({ params }: { params: TodoIdParams }) => {
      return callWithoutToken<SuccessResponse<TodoResponse>>({
        method: 'GET',
        path: `todos/${params.id}`,
      });
    },
    'POST /todos': ({ body }: { body: CreateOrPatchTodo }) => {
      return callWithoutToken<SuccessResponse<TodoResponse[]>>({
        method: 'POST',
        path: 'todos',
        body,
      });
    },
    'PATCH /todos/:id': ({
      params,
      body,
    }: {
      params: TodoIdParams;
      body: CreateOrPatchTodo;
    }) => {
      return callWithoutToken<SuccessResponse<TodoResponse[]>>({
        method: 'PATCH',
        path: `todos/${params.id}`,
        body,
      });
    },
    'DELETE /todos/:id': ({ params }: { params: TodoIdParams }) => {
      return callWithoutToken<SuccessResponse<TodoResponse[]>>({
        method: 'DELETE',
        path: `todos/${params.id}`,
      });
    },
  }) satisfies ApiRepository;
