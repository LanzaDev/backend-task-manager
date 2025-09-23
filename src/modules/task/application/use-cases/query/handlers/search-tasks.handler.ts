import { Injectable } from '@nestjs/common';
import { AbstractTaskReadRepository } from '@/modules/task/domain/repositories/task.read-repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { SearchTasksQuery } from '../implements/search-tasks.query';

@Injectable()
@QueryHandler(SearchTasksQuery)
export class SearchTasksHandler implements IQueryHandler<SearchTasksQuery> {
  constructor(
    private readonly abstractTaskReadRepository: AbstractTaskReadRepository,
  ) {}

  async execute(query: SearchTasksQuery) {
    const { requesterId, requesterRole, searchText, targetUserId } = query;

    if (!searchText || searchText.trim().length < 1) {
      return [];
    }

    if (requesterRole === 'ADMIN') {
      if (targetUserId) {
        return this.abstractTaskReadRepository.searchByUser(
          targetUserId,
          searchText.trim(),
        );
      }
      return this.abstractTaskReadRepository.searchGlobal(
        searchText.trim(),
      );
    }

    return this.abstractTaskReadRepository.searchByUser(
      requesterId,
      searchText.trim(),
    );
  }
}
